// Validates and normalises quiz input from the editor or an imported JSON file.
// Throws a 400 ApiError with a readable message on bad input.
const ApiError = require("../../shared/utils/ApiError");

const LIMITS = { maxQuestions: 100, minOptions: 2, maxOptions: 4, minTime: 5, maxTime: 120 };

const fail = (message) => {
  throw ApiError.badRequest(message);
};

const text = (v) => (typeof v === "string" || typeof v === "number" ? String(v).trim() : "");

function validateQuestion(raw, i) {
  const label = `Question ${i + 1}`;
  if (!raw || typeof raw !== "object") fail(`${label} is invalid`);

  const question = text(raw.question);
  if (!question) fail(`${label} has no text`);

  if (!Array.isArray(raw.options)) fail(`${label} needs an "options" array`);
  const options = raw.options.map(text);
  if (options.length < LIMITS.minOptions || options.length > LIMITS.maxOptions) {
    fail(`${label} must have ${LIMITS.minOptions}-${LIMITS.maxOptions} options`);
  }
  if (options.some((o) => !o)) fail(`${label} has an empty option`);
  if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) fail(`${label} has duplicate options`);

  // `answer` may be the option text or its index.
  const answer = Number.isInteger(raw.answer)
    ? options[raw.answer]
    : options.find((o) => o.toLowerCase() === text(raw.answer).toLowerCase());
  if (!answer) fail(`${label}: the answer must match one of the options`);

  const result = { question, options, answer };
  if (raw.timeLimit !== undefined && raw.timeLimit !== null && raw.timeLimit !== "") {
    const t = Number(raw.timeLimit);
    if (!(t >= LIMITS.minTime && t <= LIMITS.maxTime)) fail(`${label}: time limit must be ${LIMITS.minTime}-${LIMITS.maxTime} seconds`);
    result.timeLimit = Math.round(t);
  }
  return result;
}

function validateQuiz(raw) {
  if (!raw || typeof raw !== "object") fail("Quiz data is missing");
  const name = text(raw.name || raw.title);
  if (!name) fail("Quiz name is required");
  if (!Array.isArray(raw.questions) || raw.questions.length === 0) fail("Add at least one question");
  if (raw.questions.length > LIMITS.maxQuestions) fail(`A quiz can have at most ${LIMITS.maxQuestions} questions`);

  return {
    name: name.slice(0, 80),
    description: text(raw.description).slice(0, 200),
    category: text(raw.category).slice(0, 40) || "Custom",
    questions: raw.questions.map(validateQuestion),
  };
}

module.exports = { validateQuiz, LIMITS };
