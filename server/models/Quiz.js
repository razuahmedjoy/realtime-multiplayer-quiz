// backend/models/Quiz.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      answer: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);