const mongoose = require("mongoose");

// A lobby is the "room" for one game. Live state (players, answers, timers)
// lives in memory on the socket server; final results are saved here.
const lobbySchema = new mongoose.Schema({
  roomName: { type: String, required: true, trim: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  hostKey: { type: String, required: true }, // secret that proves who the host is
  timeLimit: { type: Number, default: 20, min: 5, max: 120 },
  status: { type: String, enum: ["waiting", "finished"], default: "waiting" },
  results: { type: mongoose.Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now, expires: "2d" }, // auto-delete old lobbies
});

module.exports = mongoose.model("Lobby", lobbySchema);
