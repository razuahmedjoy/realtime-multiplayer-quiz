// backend/routes/quizRoutes.js
const express = require("express");
const Quiz = require("../models/Quiz");

const router = express.Router();

// Create a new quiz
router.post("/create", async (req, res) => {
  const { name, questions } = req.body;
  const quiz = new Quiz({ name, questions });
  await quiz.save();
  res.json({ success: true, quizId: quiz._id });
});

// Get all quizzes
router.get("/all", async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

// Get a specific quiz by ID
router.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }
  res.json(quiz);
});

module.exports = router;