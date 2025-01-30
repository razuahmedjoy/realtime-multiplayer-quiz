// backend/server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require('dotenv').config();

const connectDB = require("./config/database");
const lobbyRoutes = require("./routes/lobbyRoutes");
const quizRoutes = require("./routes/quizRoutes");
const { setupLobbyHandlers } = require("../socket/lobbyHandlers");
const { setupQuizHandlers } = require("../socket/quizHandlers");





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


// Socket.IO
// io.on("connection", (socket) => {

//   // console.log("A user connected:", socket.id);
//   console.log("A user connected:", socket.id);


//   socket.on("create_room", async ({ lobbyId }) => {
//     socket.join(lobbyId);
//     const lobby = await Lobby.findById(lobbyId);
//     if (!lobby) {
//       socket.emit("error", "Lobby not Found");
//     }

//     io.to(lobbyId).emit("updatePlayers", lobby.players);
//   })

//   socket.on("join_lobby", async ({ lobbyId, name, team }) => {
//     try {
//       const lobby = await Lobby.findById(lobbyId);

//       if (!lobby) {
//         socket.emit("error", "Lobby not found");
//         return;
//       }

//       // Add player to the lobby
//       const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//       const player = { playerId: socket.id, name, team, color };
//       lobby.players.push(player);
//       await lobby.save();

//       // Join the Socket.IO room
//       socket.join(lobbyId);

//       // Notify the room of the new player
//       io.to(lobbyId).emit("updatePlayers", lobby.players);

//       console.log(`Player emited updatePlayers`);


//     } catch (err) {
//       console.log(err);
//       socket.emit("error", "Failed to join room");

//     }

//   });

//   // Join a lobby
//   socket.on("joinLobby", async ({ lobbyId, player }) => {
//     socket.join(lobbyId);

//     // Add player to the database
//     const lobby = await Lobby.findById(lobbyId);
//     if (lobby) {
//       lobby.players.push({ playerId: socket.id, team: player.team });
//       await lobby.save();

//       // Notify all clients in the room about the updated players
//       io.to(lobbyId).emit("updatePlayers", lobby.players);
//     }
//   });

//   // Start the quiz
//   socket.on("startQuiz", async ({ lobbyId }) => {
//     const lobby = await Lobby.findById(lobbyId).populate("quizId");
//     if (lobby && lobby.quizId) {
//       const quiz = lobby.quizId;

//       // if lobby has no players, emit error
//       if (lobby.players.length === 0) {
//         socket.emit("error", "No players in the lobby");
//         return;
//       }

//       // Start sending questions one by one
//       let currentQuestionIndex = 0;

//       const sendNextQuestion = () => {
//         if (currentQuestionIndex < quiz.questions.length) {
//           io.to(lobbyId).emit("newQuestion", { currentQuestionIndex: currentQuestionIndex, quiz: quiz.questions[currentQuestionIndex] });
//         } else {
//           io.to(lobbyId).emit("quizEnded", { message: "Quiz has ended!" });
//         }
//       };

//       // Send the first question
//       sendNextQuestion();


//     }
//   });


//   // Submit answer listener (GLOBAL, for all sockets)
//   socket.on("submitAnswer", async ({ lobbyId, playerId, answer, currentQuestion }) => {

//     try {
//       console.log(`Player ${playerId} submitted answer: ${answer}`);

//       const lobby = await Lobby.findById(lobbyId).populate("quizId");
//       if (!lobby || !lobby.quizId) return;
//       // Find the lobby the player is in
//       const quiz = lobby.quizId;
//       let currentQuestionIndex = currentQuestion;

//       const player = lobby.players.find((p) => p.playerId === playerId);
//       if (player) player.answer = answer;
//       await lobby.save();

//       const calculateAndEmitResults = async (lobby) => {
//         // Calculate scores
//         const rankedTeams = Object.entries(lobby.scores)
//           .sort((a, b) => b[1] - a[1]) // Sort descending by score
//           .map(([team, score]) => ({ team, score }));

//         // Emit final results
//         io.to(lobby._id.toString()).emit("quizEnded", {
//           message: "Quiz has ended!",
//           rankings: rankedTeams,
//           scores: lobby.scores,
//         });
//       };

//       // Determine the most common answer for each team
//       const finalizeTeamAnswers = async (lobby) => {


//         const teamAnswers = {
//           red: [],
//           blue: [],
//           green: [],
//           yellow: [],
//         };

//         // Collect all player answers by team
//         lobby.players.forEach((p) => {
//           if (p.answer) teamAnswers[p.team].push(p.answer);
//         });

//         // Find the most common answer in each team
//         const mostCommonAnswer = (answers) => {
//           if (answers.length === 0) return null;
//           const count = answers.reduce((acc, ans) => {
//             acc[ans] = (acc[ans] || 0) + 1;
//             return acc;
//           }, {});
//           return Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b));
//         };

//         const finalTeamAnswers = {
//           red: mostCommonAnswer(teamAnswers.red),
//           blue: mostCommonAnswer(teamAnswers.blue),
//           green: mostCommonAnswer(teamAnswers.green),
//           yellow: mostCommonAnswer(teamAnswers.yellow),
//         };

//         // Score calculation
//         // Update team scores
//         Object.keys(finalTeamAnswers).forEach((team) => {
//           if (finalTeamAnswers[team] === quiz.questions[currentQuestionIndex].answer) {
//             lobby.scores[team] = (lobby.scores[team] || 0) + 10;
//           }
//         });

//         // Reset player answers

//         lobby.players.forEach((p) => (p.answer = null));
//         await lobby.save();


//         const nextQuestionIndex = currentQuestion + 1;
//         if (quiz && nextQuestionIndex < quiz.questions.length) {

//           const nextQuestion = quiz.questions[nextQuestionIndex];
//           io.to(lobbyId).emit("newQuestion", { currentQuestionIndex: nextQuestionIndex, quiz: nextQuestion });
//         } else {
//           // End the quiz if no questions remain
//           await calculateAndEmitResults(lobby);
//         }


//       };

//       // Check if all players have answered
//       if (lobby.players.every((p) => p.answer !== null)) {
//         await finalizeTeamAnswers(lobby);


//       }


//     } catch (error) {
//       console.error("Error in submitAnswer:", error);
//     }
//   });



//   // Handle disconnect
//   socket.on("disconnect", async () => {
//     console.log(`User disconnected: ${socket.id}`);

//     // Remove the player from any lobby they were in
//     const lobby = await Lobby.findOne({ "players.playerId": socket.id });
//     if (lobby) {
//       // Filter out the disconnected player
//       lobby.players = lobby.players.filter((player) => player.playerId !== socket.id);
//       await lobby.save();

//       // Notify the lobby leader about the updated player list
//       io.to(lobby._id.toString()).emit("updatePlayers", lobby.players);
//     }
//   });
// });

// Connect to MongoDB


// Start server and bind to 0.0.0.0
// const PORT = process.env.PORT || 3000;

// const isProduction = process.env.NODE_ENV === "production";

// if (isProduction) {
//   server.listen(PORT, "0.0.0.0", async () => {
//     await connectDB();
//     console.log(`Server running on http://0.0.0.0:${PORT}`);
//   });
// }
// else {

//   server.listen(PORT, async () => {
//     await connectDB();
//     console.log(`Server running on http://localhost:${PORT}`);
//   });

// }