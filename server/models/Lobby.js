// backend/models/Lobby.js
const mongoose = require("mongoose");

const lobbySchema = new mongoose.Schema({
  roomName: { type: String },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  players: [
    {
      playerId: { type: String, required: true },
      name: { type: String, required: true },
      team: { type: String, enum: ["red", "blue", "green", "yellow"]},
      answer: { type: String, default: null },
      color: { type: String },
    },
  ],
  currentQuestion: { type: Number, default: 0 },
  scores: {
    red: { type: Number, default: 0 },
    blue: { type: Number, default: 0 },
    green: { type: Number, default: 0 },
    yellow: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("Lobby", lobbySchema);