// Socket.IO event handlers for a live game (the "controller" of the game module).
// Each handler validates via the service, then broadcasts via the emitter.
const gameService = require("./game.service");
const emitter = require("./game.emitter");
const withGame = require("./withGame");
const ApiError = require("../../shared/utils/ApiError");

const hostOnly = { hostOnly: true };

function registerGameSocket(io, socket) {
  // ---- shared flow helpers ----

  const revealQuestion = (game) => {
    const reveal = gameService.endQuestion(game);
    if (!reveal) return;
    emitter.emitQuestionEnded(io, game, reveal);
    emitter.emitLobbyState(io, game);
  };

  const onTimeUp = (game) => () => revealQuestion(game);

  const announceQuestion = (game) => {
    emitter.emitNewQuestion(io, game);
    emitter.emitLobbyState(io, game);
  };

  const finish = async (game) => {
    const results = await gameService.finishGame(game);
    emitter.emitQuizEnded(io, game, results);
    emitter.emitLobbyState(io, game);
  };

  const checkAllAnswered = (game) => {
    if (game.status !== "question") return;
    emitter.emitAnswerProgress(io, game);
    if (gameService.allOnlineAnswered(game)) revealQuestion(game);
  };

  // ---- host events ----

  socket.on(
    "hostJoin",
    withGame((game) => {
      socket.join(game.lobbyId);
      socket.data = { lobbyId: game.lobbyId, isHost: true };
      emitter.sendCurrentPhase(socket, game);
      return { state: gameService.lobbyState(game) };
    }, hostOnly)
  );

  socket.on(
    "startQuiz",
    withGame((game) => {
      gameService.startGame(game, onTimeUp(game));
      announceQuestion(game);
    }, hostOnly)
  );

  socket.on(
    "revealAnswer",
    withGame((game) => {
      gameService.revealNow(game);
      emitter.emitQuestionEnded(io, game, game.lastReveal);
      emitter.emitLobbyState(io, game);
    }, hostOnly)
  );

  socket.on(
    "nextQuestion",
    withGame(async (game, { index }) => {
      const next = gameService.nextQuestion(game, index, onTimeUp(game));
      if (next === "question") announceQuestion(game);
      else await finish(game);
    }, hostOnly)
  );

  socket.on(
    "endQuiz",
    withGame(async (game) => {
      if (game.status === "finished") return;
      gameService.endQuestion(game); // score answers given so far, if a question is running
      await finish(game);
    }, hostOnly)
  );

  socket.on(
    "restartQuiz",
    withGame(async (game) => {
      await gameService.restartGame(game);
      emitter.emitLobbyState(io, game);
    }, hostOnly)
  );

  socket.on(
    "kickPlayer",
    withGame((game, { playerId }) => {
      const player = gameService.kickPlayer(game, playerId);
      emitter.emitKicked(io, player.socketId);
      io.in(player.socketId).socketsLeave(game.lobbyId);
      emitter.emitLobbyState(io, game);
      checkAllAnswered(game);
    }, hostOnly)
  );

  // ---- player events ----

  // Join, or re-join after a refresh / dropped connection using the saved playerId
  socket.on(
    "joinLobby",
    withGame((game, data) => {
      const player = gameService.joinPlayer(game, data, socket.id);
      socket.join(game.lobbyId);
      socket.data = { lobbyId: game.lobbyId, playerId: player.playerId };
      emitter.emitLobbyState(io, game);
      emitter.sendCurrentPhase(socket, game, player);
      return { player: gameService.publicPlayer(player), state: gameService.lobbyState(game) };
    })
  );

  socket.on(
    "submitAnswer",
    withGame((game, { answer }) => {
      const { lobbyId, playerId } = socket.data || {};
      if (lobbyId !== game.lobbyId) throw ApiError.forbidden("You are not in this room");
      gameService.submitAnswer(game, playerId, answer);
      checkAllAnswered(game);
    })
  );

  // Keep the seat so the player can reconnect. We don't end the question here:
  // a refresh would cut the round short for everyone; the timer will end it.
  socket.on("disconnect", () => {
    const { lobbyId, playerId } = socket.data || {};
    const game = lobbyId && gameService.findLoadedGame(lobbyId);
    if (game && gameService.disconnectPlayer(game, playerId, socket.id)) emitter.emitLobbyState(io, game);
  });
}

module.exports = registerGameSocket;
