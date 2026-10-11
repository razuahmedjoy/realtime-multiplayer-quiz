// Live game state and rules. Knows nothing about Socket.IO: the socket layer
// calls these functions and decides what to broadcast.
//
// Live state is kept in memory (not MongoDB) so concurrent answers can't
// overwrite each other and timers stay accurate. Final results are saved to
// the lobby when a game ends. This requires a single server instance.
const crypto = require("crypto");
const { lobbyService } = require("../lobby");
const ApiError = require("../../shared/utils/ApiError");

const TEAMS = ["red", "blue", "green", "yellow"];
const MAX_PLAYERS = 100;
const MAX_NAME_LENGTH = 20;
const BASE_POINTS = 100;
const MAX_SPEED_BONUS = 100; // answering instantly earns the full bonus
const ANSWER_GRACE_MS = 500; // tolerate a little network latency at the buzzer
const IDLE_TTL_MS = 2 * 60 * 60 * 1000;

const games = new Map(); // lobbyId -> game
const loading = new Map(); // lobbyId -> Promise<game>

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

async function loadGame(lobbyId) {
  const lobby = await lobbyService.findLobbyWithQuiz(lobbyId);
  if (!lobby) return null;

  const game = {
    lobbyId: String(lobby._id),
    roomName: lobby.roomName,
    hostKey: lobby.hostKey,
    quizName: lobby.quizId.name,
    questions: lobby.quizId.questions.map((q) => ({
      question: q.question,
      options: q.options,
      answer: q.answer,
      timeLimit: q.timeLimit || lobby.timeLimit,
    })),
    status: lobby.status === "finished" ? "finished" : "waiting", // waiting | question | reveal | finished
    currentQuestion: -1,
    questionEndsAt: null,
    timer: null,
    players: new Map(), // playerId -> player
    lastReveal: null,
    results: lobby.results,
    lastActivity: Date.now(),
  };
  games.set(game.lobbyId, game);
  return game;
}

/** The live game for a lobby, loaded from MongoDB the first time. Throws 404 if missing. */
async function getGame(lobbyId) {
  const id = String(lobbyId || "");
  let game = games.get(id);
  if (!game) {
    // Two sockets may ask for the same lobby at once, so share one load.
    if (!loading.has(id)) loading.set(id, loadGame(id).finally(() => loading.delete(id)));
    game = await loading.get(id);
  }
  if (!game) throw ApiError.notFound("Room not found");
  game.lastActivity = Date.now();
  return game;
}

/** Game already in memory (no DB access), or undefined. */
const findLoadedGame = (lobbyId) => games.get(String(lobbyId));

function assertHost(game, hostKey) {
  if (!hostKey || hostKey !== game.hostKey) throw ApiError.forbidden("Only the host can do that");
}

// Forget games nobody has touched for a while (results stay in MongoDB).
setInterval(() => {
  const cutoff = Date.now() - IDLE_TTL_MS;
  for (const [id, game] of games) {
    if (game.lastActivity < cutoff) {
      clearTimeout(game.timer);
      games.delete(id);
    }
  }
}, 15 * 60 * 1000).unref();

// ---------------------------------------------------------------------------
// Players
// ---------------------------------------------------------------------------

/** Adds a new player, or re-attaches an existing one (after a refresh) by playerId. */
function joinPlayer(game, { playerId, name, team }, socketId) {
  let player = playerId && game.players.get(playerId);

  if (!player) {
    if (playerId && !name) throw ApiError.notFound("Your seat in this game has expired. Please join again.");
    if (game.status === "finished") throw ApiError.conflict("This game has already finished");
    if (game.players.size >= MAX_PLAYERS) throw ApiError.conflict("This room is full");

    const cleanName = String(name || "").trim().replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH);
    if (!cleanName) throw ApiError.badRequest("Please enter your name");
    if (!TEAMS.includes(team)) throw ApiError.badRequest("Please pick a team");
    const taken = [...game.players.values()].some((p) => p.name.toLowerCase() === cleanName.toLowerCase());
    if (taken) throw ApiError.conflict("That name is already taken in this room");

    player = { playerId: crypto.randomUUID(), name: cleanName, team, score: 0, correct: 0, answer: null, answeredAt: null };
    game.players.set(player.playerId, player);
  }

  player.socketId = socketId;
  player.connected = true;
  return player;
}

/** Marks a player offline (keeping their seat). Returns false if nothing changed. */
function disconnectPlayer(game, playerId, socketId) {
  const player = game.players.get(playerId);
  if (!player || player.socketId !== socketId) return false;
  player.connected = false;
  return true;
}

function kickPlayer(game, playerId) {
  const player = game.players.get(playerId);
  if (!player) throw ApiError.notFound("Player not found");
  game.players.delete(playerId);
  return player;
}

// ---------------------------------------------------------------------------
// Game flow: waiting -> question -> reveal -> question ... -> finished
// ---------------------------------------------------------------------------

/** Starts question `index`. `onTimeUp` is called if the timer runs out. */
function startQuestion(game, index, onTimeUp) {
  clearTimeout(game.timer);
  const q = game.questions[index];

  game.status = "question";
  game.currentQuestion = index;
  game.questionEndsAt = Date.now() + q.timeLimit * 1000;
  game.lastReveal = null;
  game.players.forEach((p) => {
    p.answer = null;
    p.answeredAt = null;
  });
  game.timer = setTimeout(onTimeUp, q.timeLimit * 1000);
}

function startGame(game, onTimeUp) {
  if (game.status !== "waiting") throw ApiError.conflict("The quiz has already started");
  if (game.players.size === 0) throw ApiError.conflict("Wait for at least one player to join");
  startQuestion(game, 0, onTimeUp);
}

/** Scores the current question and moves to "reveal". Returns the reveal, or null if not running. */
function endQuestion(game) {
  if (game.status !== "question") return null;
  clearTimeout(game.timer);

  const q = game.questions[game.currentQuestion];
  const limitMs = q.timeLimit * 1000;
  const counts = Object.fromEntries(q.options.map((o) => [o, 0]));
  const results = {};

  game.players.forEach((p) => {
    const correct = p.answer === q.answer;
    const timeLeft = Math.max(0, game.questionEndsAt - (p.answeredAt || game.questionEndsAt));
    const points = correct ? BASE_POINTS + Math.round((MAX_SPEED_BONUS * timeLeft) / limitMs) : 0;
    if (p.answer !== null) counts[p.answer] += 1;
    if (correct) p.correct += 1;
    p.score += points;
    results[p.playerId] = { answer: p.answer, correct, points };
  });

  game.status = "reveal";
  game.lastReveal = {
    index: game.currentQuestion,
    total: game.questions.length,
    question: q.question,
    options: q.options,
    correctAnswer: q.answer,
    counts,
    results,
    leaderboard: leaderboard(game),
    teamScores: teamScores(game),
  };
  return game.lastReveal;
}

function revealNow(game) {
  if (game.status !== "question") throw ApiError.conflict("No question is running");
  return endQuestion(game);
}

/**
 * Records a player's answer. The player comes from their socket, never from
 * an id sent by the client. Returns true when every online player has answered.
 */
function submitAnswer(game, playerId, answer) {
  const player = game.players.get(playerId);
  if (!player) throw ApiError.forbidden("You are not in this room");
  if (game.status !== "question" || Date.now() > game.questionEndsAt + ANSWER_GRACE_MS) throw ApiError.conflict("Time's up!");
  if (player.answer !== null) throw ApiError.conflict("You already answered");
  if (!game.questions[game.currentQuestion].options.includes(answer)) throw ApiError.badRequest("Invalid answer");

  player.answer = answer;
  player.answeredAt = Date.now();
  return allOnlineAnswered(game);
}

function allOnlineAnswered(game) {
  if (game.status !== "question") return false;
  const online = [...game.players.values()].filter((p) => p.connected);
  return online.length > 0 && online.every((p) => p.answer !== null);
}

/**
 * Moves on from a reveal. `index` guards against a double-click skipping a question.
 * Returns "question" if a new question started, or "finished".
 */
function nextQuestion(game, index, onTimeUp) {
  if (game.status !== "reveal" || index !== game.currentQuestion) throw ApiError.conflict("Already moved on");
  const next = game.currentQuestion + 1;
  if (next < game.questions.length) {
    startQuestion(game, next, onTimeUp);
    return "question";
  }
  return "finished";
}

async function finishGame(game) {
  clearTimeout(game.timer);
  game.status = "finished";
  game.results = { leaderboard: leaderboard(game), teamScores: teamScores(game), totalQuestions: game.questions.length };
  await lobbyService.saveResults(game.lobbyId, game.results).catch((err) => console.error("Failed to save results:", err.message));
  return game.results;
}

/** Back to the lobby with the same (online) players and zero scores. */
async function restartGame(game) {
  if (game.status !== "finished") throw ApiError.conflict("The quiz is still running");
  for (const [id, p] of game.players) {
    if (!p.connected) game.players.delete(id);
    else Object.assign(p, { score: 0, correct: 0, answer: null, answeredAt: null });
  }
  Object.assign(game, { status: "waiting", currentQuestion: -1, lastReveal: null, results: null });
  await lobbyService.clearResults(game.lobbyId);
}

// ---------------------------------------------------------------------------
// Views sent to clients (never include the correct answer before the reveal)
// ---------------------------------------------------------------------------

const publicPlayer = (p) => ({
  playerId: p.playerId,
  name: p.name,
  team: p.team,
  connected: p.connected,
  score: p.score,
  correct: p.correct,
});

function leaderboard(game) {
  const rows = [...game.players.values()].map(publicPlayer).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  rows.forEach((row, i) => {
    row.rank = i > 0 && rows[i - 1].score === row.score ? rows[i - 1].rank : i + 1;
  });
  return rows;
}

// Team score = sum of its players' scores. Only teams with players are listed.
function teamScores(game) {
  const totals = {};
  for (const p of game.players.values()) {
    totals[p.team] = totals[p.team] || { team: p.team, score: 0, players: 0 };
    totals[p.team].score += p.score;
    totals[p.team].players += 1;
  }
  return Object.values(totals).sort((a, b) => b.score - a.score);
}

const lobbyState = (game) => ({
  roomName: game.roomName,
  quizName: game.quizName,
  status: game.status,
  currentQuestion: game.currentQuestion,
  totalQuestions: game.questions.length,
  players: [...game.players.values()].map(publicPlayer),
  teamScores: teamScores(game),
});

function answerProgress(game) {
  const players = [...game.players.values()];
  return { answeredCount: players.filter((p) => p.answer !== null).length, playerCount: players.length };
}

function questionPayload(game) {
  const q = game.questions[game.currentQuestion];
  return {
    index: game.currentQuestion,
    total: game.questions.length,
    question: q.question,
    options: q.options,
    timeLimit: q.timeLimit,
    endsAt: game.questionEndsAt,
    serverTime: Date.now(), // lets clients correct for clock differences
    ...answerProgress(game),
  };
}

module.exports = {
  getGame,
  findLoadedGame,
  assertHost,
  joinPlayer,
  disconnectPlayer,
  kickPlayer,
  startGame,
  endQuestion,
  revealNow,
  submitAnswer,
  allOnlineAnswered,
  nextQuestion,
  finishGame,
  restartGame,
  publicPlayer,
  lobbyState,
  answerProgress,
  questionPayload,
};
