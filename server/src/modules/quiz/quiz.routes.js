const express = require("express");
const asyncHandler = require("../../shared/utils/asyncHandler");
const quizController = require("./quiz.controller");

const router = express.Router();

router.get("/", asyncHandler(quizController.list));
router.get("/:id", asyncHandler(quizController.getById));
router.post("/", asyncHandler(quizController.create));
router.put("/:id", asyncHandler(quizController.update));
router.delete("/:id", asyncHandler(quizController.remove));

module.exports = router;
