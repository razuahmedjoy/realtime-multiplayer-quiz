// Business logic for lobbies (game rooms): creation, public info, saved results.
const crypto = require("crypto");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const Lobby = require("./lobby.model");
const { quizService } = require("../quiz");
const { frontendUrl } = require("../../config/env");
const ApiError = require("../../shared/utils/ApiError");

const MIN_TIME = 5;
const MAX_TIME = 120;

const createLobby = async ({ quizId, roomName, timeLimit }) => {
  const name = String(roomName || "").trim();
  if (!name) throw ApiError.badRequest("Room name is required");
  await quizService.getQuizById(quizId); // throws 404 if the quiz doesn't exist

  return Lobby.create({
    roomName: name.slice(0, 60),
    quizId,
    timeLimit: Math.min(Math.max(Number(timeLimit) || 20, MIN_TIME), MAX_TIME),
    hostKey: crypto.randomBytes(16).toString("hex"),
  });
};

/** Lobby with its quiz populated, or null. Used by the game module. */
const findLobbyWithQuiz = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const lobby = await Lobby.findById(id).populate("quizId");
  return lobby && lobby.quizId ? lobby : null;
};

// Players join at <frontend>/player/<lobbyId>. FRONTEND_URL wins, otherwise the caller's origin.
const buildRoomUrl = (lobbyId, origin) => `${frontendUrl || (origin || "").replace(/\/$/, "")}/player/${lobbyId}`;

/** Public room info shown to the host (with QR code) and to players before joining. */
const getLobbyInfo = async (id, origin) => {
  const lobby = await findLobbyWithQuiz(id);
  if (!lobby) throw ApiError.notFound("Room not found");

  const roomUrl = buildRoomUrl(lobby._id, origin);
  return {
    id: lobby._id,
    roomName: lobby.roomName,
    quizName: lobby.quizId.name,
    totalQuestions: lobby.quizId.questions.length,
    timeLimit: lobby.timeLimit,
    status: lobby.status,
    roomUrl,
    qrCode: await QRCode.toDataURL(roomUrl, { margin: 1, width: 400 }),
  };
};

const saveResults = (id, results) => Lobby.updateOne({ _id: id }, { status: "finished", results });

const clearResults = (id) => Lobby.updateOne({ _id: id }, { status: "waiting", results: null });

module.exports = { createLobby, findLobbyWithQuiz, getLobbyInfo, saveResults, clearResults };
