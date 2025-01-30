// backend/server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require('dotenv').config();

const connectDB = require("./config/database");
const lobbyRoutes = require("./routes/lobbyRoutes");
const quizRoutes = require("./routes/quizRoutes");
const { setupQuizHandlers } = require("./socket/quizHandlers");
const { setupLobbyHandlers } = require("./socket/lobbyHandlers");







// Initialize Express & HTTP Server
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Middleware
// Enable CORS for Express
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());


// Routes
app.use("/api/lobby", lobbyRoutes);
app.use("/api/quiz", quizRoutes);


// Socket.IO Handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  setupLobbyHandlers(socket, io);
  setupQuizHandlers(socket, io);

  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

