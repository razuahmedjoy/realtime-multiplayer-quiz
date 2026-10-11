const express = require("express");
const asyncHandler = require("../../shared/utils/asyncHandler");
const lobbyController = require("./lobby.controller");

const router = express.Router();

router.post("/", asyncHandler(lobbyController.create));
router.get("/:id", asyncHandler(lobbyController.getById));

module.exports = router;
