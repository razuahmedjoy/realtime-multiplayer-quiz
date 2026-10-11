const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: [{ type: String, required: true, trim: true }],
    answer: { type: String, required: true }, // must match one of the options
    timeLimit: { type: Number, min: 5, max: 120 }, // optional per-question override (seconds)
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    category: { type: String, default: "Custom", trim: true },
    isBuiltIn: { type: Boolean, default: false }, // seeded from ./data, read-only
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
