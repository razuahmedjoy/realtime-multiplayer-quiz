// backend/routes/lobbyRoutes.js
const express = require("express");
const Lobby = require("../models/Lobby");
const Quiz = require("../models/Quiz");
const QRCode = require("qrcode");

const router = express.Router();

// Create a lobby
router.post("/create", async (req, res) => {
  const { quizId, roomName } = req.body;

  try {
    // Validate quizId
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Create a new lobby
    const lobby = new Lobby({
      roomName,
      quizId,
      players: [],
      currentQuestion: 0,
      scores: { red: 0, blue: 0, green: 0, yellow: 0 },
    });

    await lobby.save();

    // Generate a QR code for the room URL
    const roomUrl = `http://localhost:5173/player/${lobby._id}`;
    const qrCode = await QRCode.toDataURL(roomUrl);

    res.json({ lobbyId: lobby._id, qrCode, roomUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to create lobby" });
  }
});

// Join a lobby
router.post("/join", async (req, res) => {
  const { lobbyId, playerId, team } = req.body;
  const lobby = await Lobby.findById(lobbyId);
  lobby.players.push({ playerId, team });
  await lobby.save();
  res.json({ success: true });
});

module.exports = router;