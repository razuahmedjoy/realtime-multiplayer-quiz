// Business logic for quizzes: listing, CRUD and the built-in question sets.
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Quiz = require("./quiz.model");
const { validateQuiz } = require("./quiz.validator");
const ApiError = require("../../shared/utils/ApiError");

const BUILT_IN_DIR = path.join(__dirname, "data");

// Returns quizzes without their questions so the list stays small.
const listQuizzes = () =>
  Quiz.aggregate([
    { $sort: { isBuiltIn: 1, updatedAt: -1 } },
    { $project: { name: 1, description: 1, category: 1, isBuiltIn: 1, updatedAt: 1, questionCount: { $size: "$questions" } } },
  ]);

const getQuizById = async (id) => {
  const quiz = mongoose.isValidObjectId(id) ? await Quiz.findById(id) : null;
  if (!quiz) throw ApiError.notFound("Quiz not found");
  return quiz;
};

const createQuiz = (data) => Quiz.create(validateQuiz(data));

const getEditableQuiz = async (id) => {
  const quiz = await getQuizById(id);
  if (quiz.isBuiltIn) throw ApiError.forbidden("Built-in quizzes can't be changed. Duplicate it instead.");
  return quiz;
};

const updateQuiz = async (id, data) => {
  const quiz = await getEditableQuiz(id);
  quiz.set(validateQuiz(data));
  return quiz.save();
};

const deleteQuiz = async (id) => {
  const quiz = await getEditableQuiz(id);
  await quiz.deleteOne();
};

// ---- Built-in question sets (./data/*.json) ----

const loadBuiltInQuizzes = () => {
  const files = fs.readdirSync(BUILT_IN_DIR).filter((file) => file.endsWith(".json"));
  if (files.length === 0) throw new Error(`No built-in quiz files found in ${BUILT_IN_DIR}`);
  return files.map((file) => {
    try {
      return validateQuiz(JSON.parse(fs.readFileSync(path.join(BUILT_IN_DIR, file), "utf8")));
    } catch (err) {
      throw new Error(`${file}: ${err.message}`);
    }
  });
};

/** Upserts every built-in quiz by name. User-created quizzes are never touched. */
const syncBuiltInQuizzes = async () => {
  const quizzes = loadBuiltInQuizzes();
  for (const quiz of quizzes) {
    await Quiz.findOneAndUpdate({ name: quiz.name, isBuiltIn: true }, { ...quiz, isBuiltIn: true }, { upsert: true });
  }
  return quizzes.length;
};

const seedBuiltInQuizzesIfEmpty = async () => {
  if (await Quiz.exists({ isBuiltIn: true })) return 0;
  return syncBuiltInQuizzes();
};

module.exports = {
  listQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  syncBuiltInQuizzes,
  seedBuiltInQuizzesIfEmpty,
};
