// HTTP layer for quizzes: reads the request, calls the service, sends the response.
const quizService = require("./quiz.service");

const list = async (req, res) => {
  res.json(await quizService.listQuizzes());
};

const getById = async (req, res) => {
  res.json(await quizService.getQuizById(req.params.id));
};

const create = async (req, res) => {
  const quiz = await quizService.createQuiz(req.body);
  res.status(201).json({ id: quiz._id });
};

const update = async (req, res) => {
  const quiz = await quizService.updateQuiz(req.params.id, req.body);
  res.json({ id: quiz._id });
};

const remove = async (req, res) => {
  await quizService.deleteQuiz(req.params.id);
  res.status(204).end();
};

module.exports = { list, getById, create, update, remove };
