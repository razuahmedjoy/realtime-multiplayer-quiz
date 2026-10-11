// Entry point: connect to MongoDB, seed built-in quizzes, start HTTP + Socket.IO.
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { port, corsOrigin } = require("./config/env");
const connectDB = require("./config/database");
const { quizService } = require("./modules/quiz");
const { registerGameSocket } = require("./modules/game");

const start = async () => {
  await connectDB();

  const seeded = await quizService.seedBuiltInQuizzesIfEmpty();
  if (seeded) console.log(`Seeded ${seeded} built-in quizzes`);

  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: corsOrigin } });
  io.on("connection", (socket) => registerGameSocket(io, socket));

  server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
};

start();
