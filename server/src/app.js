// Express application: middlewares, module routes and error handling.
const express = require("express");
const cors = require("cors");
const { corsOrigin } = require("./config/env");
const { quizRoutes } = require("./modules/quiz");
const { lobbyRoutes } = require("./modules/lobby");
const notFound = require("./shared/middlewares/notFound");
const errorHandler = require("./shared/middlewares/errorHandler");

const app = express();

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/quizzes", quizRoutes);
app.use("/api/lobbies", lobbyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
