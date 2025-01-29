// backend/seed.js
const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");
require("dotenv").config();

const quizzes = {
  "General Knowledge": [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
    },
  ],
  "Science": [
    {
      question: "What planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["H2O", "O2", "CO2", "NaCl"],
      answer: "H2O",
    },
  ],
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log("Cleared existing quizzes");

    // Insert new quizzes
    for (const [name, questions] of Object.entries(quizzes)) {
      const quiz = new Quiz({ name, questions });
      await quiz.save();
      console.log(`Quiz "${name}" saved with ID: ${quiz._id}`);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

seedDatabase();