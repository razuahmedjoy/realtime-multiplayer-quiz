// Everything the server pushes to clients over Socket.IO lives here,
// so event names and payloads are defined in one place.
const gameService = require("./game.service");

const EVENTS = {
  lobbyState: "lobbyState",
  newQuestion: "newQuestion",
  answerProgress: "answerProgress",
  questionEnded: "questionEnded",
  quizEnded: "quizEnded",
  kicked: "kicked",
};

const toRoom = (io, game) => io.to(game.lobbyId);

const emitLobbyState = (io, game) => toRoom(io, game).emit(EVENTS.lobbyState, gameService.lobbyState(game));

const emitNewQuestion = (io, game) => toRoom(io, game).emit(EVENTS.newQuestion, gameService.questionPayload(game));

const emitAnswerProgress = (io, game) => toRoom(io, game).emit(EVENTS.answerProgress, gameService.answerProgress(game));

const emitQuestionEnded = (io, game, reveal) => toRoom(io, game).emit(EVENTS.questionEnded, reveal);

const emitQuizEnded = (io, game, results) => toRoom(io, game).emit(EVENTS.quizEnded, results);

const emitKicked = (io, socketId) => io.to(socketId).emit(EVENTS.kicked);

/** Brings a (re)connecting socket up to date with whatever is on screen right now. */
function sendCurrentPhase(socket, game, player) {
  if (game.status === "question") {
    socket.emit(EVENTS.newQuestion, { ...gameService.questionPayload(game), yourAnswer: player ? player.answer : null });
  }
  if (game.status === "reveal") socket.emit(EVENTS.questionEnded, game.lastReveal);
  if (game.status === "finished" && game.results) socket.emit(EVENTS.quizEnded, game.results);
}

module.exports = {
  emitLobbyState,
  emitNewQuestion,
  emitAnswerProgress,
  emitQuestionEnded,
  emitQuizEnded,
  emitKicked,
  sendCurrentPhase,
};
