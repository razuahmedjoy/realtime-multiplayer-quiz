// Re-syncs the built-in quizzes from src/modules/quiz/data/*.json into MongoDB.
// Usage: npm run seed   (your own quizzes are never touched)
const mongoose = require("mongoose");
const connectDB = require("../config/database");
const { quizService } = require("../modules/quiz");

connectDB()
  .then(() => quizService.syncBuiltInQuizzes())
  .then((count) => console.log(`Synced ${count} built-in quizzes`))
  .catch((err) => {
    console.error("Seeding error:", err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
