// const Lobby = require("../server/models/Lobby");

// const activeTimers = new Map(); // Store quiz timers

// const setupQuizHandlers = (socket, io) => {

//     socket.on("startQuiz", async ({ lobbyId }) => {
//         const lobby = await Lobby.findById(lobbyId).populate("quizId");
//         if (!lobby || !lobby.quizId || lobby.players.length === 0) {
//             io.to(lobbyId).emit("error", "Invalid lobby or no players.");
//             return;
//         }

//         const quiz = lobby.quizId;
//         let currentQuestionIndex = 0;

//         const sendNextQuestion = () => {
//             if (currentQuestionIndex < quiz.questions.length) {

//                 io.to(lobbyId).emit("newQuestion", {
//                     currentQuestionIndex,
//                     quiz: quiz.questions[currentQuestionIndex],
//                     timeLimit: 20, // Set the time limit for each question
//                 });

//                 // Start the timer for this question
//                 startQuestionTimer(io, lobbyId, currentQuestionIndex, quiz);
//             }
//         };

//         sendNextQuestion();
//     });

//     socket.on("submitAnswer", async ({ lobbyId, playerId, answer, currentQuestion }) => {
//         try {
//             console.log(`Player ${playerId} submitted answer: ${answer}`);

//             const lobby = await Lobby.findById(lobbyId).populate("quizId");
//             if (!lobby || !lobby.quizId) return;

//             let currentQuestionIndex = currentQuestion;

//             const player = lobby.players.find((p) => p.playerId === playerId);
//             if (player) player.answer = answer;
//             await lobby.save();

//             // Check if all players have submitted their answers
//             if (lobby.players.every((p) => p.answer !== null)) {
//                 // Stop the timer when all players have answered
//                 if (activeTimers.has(lobbyId)) {
//                     clearTimeout(activeTimers.get(lobbyId));
//                     activeTimers.delete(lobbyId);
//                 }

//                 // Finalize answers and move to the next question
//                 await finalizeTeamAnswers(io, lobby, currentQuestionIndex);
//             }
//         } catch (error) {
//             console.error("Error in submitAnswer:", error);
//         }
//     });

//     // Stop the timer when the quiz ends (handle time up manually if needed)
//     socket.on("timeUp", ({ lobbyId }) => {

//         if (activeTimers.has(lobbyId)) {
//             clearTimeout(activeTimers.get(lobbyId));
//             activeTimers.delete(lobbyId);
//         }
//         io.to(lobbyId).emit("timeUp", { message: "Time is up for this question!" });
//     });
// };

// // Process team answers and determine scores
// async function finalizeTeamAnswers(io, lobby, currentQuestionIndex) {
//     const quiz = lobby.quizId;
//     const teamAnswers = { red: [], blue: [], green: [], yellow: [] };

//     lobby.players.forEach((p) => {
//         if (p.answer) teamAnswers[p.team].push(p.answer);

//     });

//     const mostCommonAnswer = (answers) => {
//         if (answers.length === 0) return null;
//         const count = answers.reduce((acc, ans) => {
//             acc[ans] = (acc[ans] || 0) + 1;
//             return acc;
//         }, {});
//         return Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b));
//     };

//     Object.keys(teamAnswers).forEach((team) => {
//         if (mostCommonAnswer(teamAnswers[team]) === quiz.questions[currentQuestionIndex].answer) {
//             lobby.scores[team] = (lobby.scores[team] || 0) + 10;
//         }
//     });

//     lobby.players.forEach((p) => (p.answer = null)); // Reset player answers
//     await lobby.save();

//     const nextQuestionIndex = currentQuestionIndex + 1;

//     if (nextQuestionIndex < quiz.questions.length) {

//         io.to(lobby._id.toString()).emit("newQuestion", {
//             currentQuestionIndex: nextQuestionIndex,
//             quiz: quiz.questions[nextQuestionIndex],
//             timeLimit: 20,
//         });
//         // Start the timer again for the next question
//         startQuestionTimer(io, lobby._id.toString(), nextQuestionIndex, quiz);

//     } else {
//         calculateAndEmitResults(io, lobby);
//     }
// }

// // Emit final rankings
// async function calculateAndEmitResults(io, lobby) {
//     // Clear any active timers for this lobby
//     if (activeTimers.has(lobby._id.toString())) {
//         clearTimeout(activeTimers.get(lobby._id.toString()));
//         activeTimers.delete(lobby._id.toString());
//     }

//     const rankedTeams = Object.entries(lobby.scores)
//         .sort((a, b) => b[1] - a[1])
//         .map(([team, score]) => ({ team, score }));

//     io.to(lobby._id.toString()).emit("quizEnded", {
//         message: "Quiz has ended!",
//         rankings: rankedTeams,
//         scores: lobby.scores,
//     });
// }

// // Start a timer for each question and send a 'timeUp' event when it expires
// function startQuestionTimer(io, lobbyId, currentQuestionIndex, quiz) {

//     const timer = setTimeout(() => {
//         io.to(lobbyId).emit("timeUp", { message: "Time is up for this question!" });
//         finalizeTeamAnswers(io, lobbyId, currentQuestionIndex); // Proceed to next question
//     }, 20000); // Set the timeout to 20 seconds per question

//     activeTimers.set(lobbyId, timer); // Store the timer for this lobby
// }

// module.exports = { setupQuizHandlers };


const Lobby = require("../server/models/Lobby");

const activeTimers = new Map(); // Store quiz timers

const setupQuizHandlers = (socket, io) => {

    socket.on("startQuiz", async ({ lobbyId }) => {
        console.log(`[Event] startQuiz triggered for lobbyId: ${lobbyId}`);

        const lobby = await Lobby.findById(lobbyId).populate("quizId");
        if (!lobby || !lobby.quizId || lobby.players.length === 0) {
            console.log(`[Error] Invalid lobby or no players. LobbyId: ${lobbyId}`);
            io.to(lobbyId).emit("error", "Invalid lobby or no players.");
            return;
        }

        const quiz = lobby.quizId;
        let currentQuestionIndex = 0;

        const sendNextQuestion = () => {
            if (currentQuestionIndex < quiz.questions.length) {
                console.log(`[Event] Sending next question for index: ${currentQuestionIndex}`);
                io.to(lobbyId).emit("newQuestion", {
                    currentQuestionIndex,
                    quiz: quiz.questions[currentQuestionIndex],
                    timeLimit: 20, // Set the time limit for each question
                });

                // Start the timer for this question
                startQuestionTimer(io,lobby, lobbyId, currentQuestionIndex, quiz);
            }
        };

        sendNextQuestion();
    });

    socket.on("submitAnswer", async ({ lobbyId, playerId, answer, currentQuestion }) => {
        console.log(`[Event] submitAnswer received. LobbyId: ${lobbyId}, PlayerId: ${playerId}, Answer: ${answer}, CurrentQuestion: ${currentQuestion}`);

        try {
            const lobby = await Lobby.findById(lobbyId).populate("quizId");
            if (!lobby || !lobby.quizId) {
                console.log(`[Error] Invalid lobbyId or quizId. LobbyId: ${lobbyId}`);
                return;
            }

            let currentQuestionIndex = currentQuestion;

            const player = lobby.players.find((p) => p.playerId === playerId);
            if (player) player.answer = answer;
            await lobby.save();

            // Check if all players have submitted their answers
            if (lobby.players.every((p) => p.answer !== null)) {
                console.log(`[Event] All players have submitted answers. Finalizing answers for current question.`);
                // Stop the timer when all players have answered
                if (activeTimers.has(lobbyId)) {
                    clearTimeout(activeTimers.get(lobbyId));
                    activeTimers.delete(lobbyId);
                }

                // Finalize answers and move to the next question
                await finalizeTeamAnswers(io, lobby, lobbyId, currentQuestionIndex);
            }
        } catch (error) {
            console.error("[Error] Error in submitAnswer:", error);
        }
    });

    // Stop the timer when the quiz ends (handle time up manually if needed)
    socket.on("timeUp", ({ lobbyId }) => {
        console.log(`[Event] timeUp triggered for lobbyId: ${lobbyId}`);

        if (activeTimers.has(lobbyId)) {
            clearTimeout(activeTimers.get(lobbyId));
            activeTimers.delete(lobbyId);
        }
        io.to(lobbyId).emit("timeUp", { message: "Time is up for this question!" });
    });
};

// Process team answers and determine scores
async function finalizeTeamAnswers(io, lobby, lobbyId, currentQuestionIndex) {
    console.log(`[Event] finalizeTeamAnswers triggered. LobbyId: ${lobby._id.toString()}, CurrentQuestionIndex: ${currentQuestionIndex}`);

    const quiz = lobby.quizId;
    const teamAnswers = { red: [], blue: [], green: [], yellow: [] };

    lobby.players.forEach((p) => {
        if (p.answer) teamAnswers[p.team].push(p.answer);
    });

    const mostCommonAnswer = (answers) => {
        if (answers.length === 0) return null;
        const count = answers.reduce((acc, ans) => {
            acc[ans] = (acc[ans] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b));
    };

    Object.keys(teamAnswers).forEach((team) => {
        if (mostCommonAnswer(teamAnswers[team]) === quiz.questions[currentQuestionIndex].answer) {
            console.log(`[Event] Team ${team} answered correctly. Awarding points.`);
            lobby.scores[team] = (lobby.scores[team] || 0) + 10;
        }
    });

    lobby.players.forEach((p) => (p.answer = null)); // Reset player answers
    await lobby.save();

    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < quiz.questions.length) {
        console.log(`[Event] Moving to next question index: ${nextQuestionIndex}`);
        io.to(lobby._id.toString()).emit("newQuestion", {
            currentQuestionIndex: nextQuestionIndex,
            quiz: quiz.questions[nextQuestionIndex],
            timeLimit: 20,
        });
        // Start the timer again for the next question
        startQuestionTimer(io, lobby, lobby._id.toString(), nextQuestionIndex, quiz);

    } else {
        console.log("[Event] Quiz ended. Calculating and emitting results.");
        calculateAndEmitResults(io, lobby);
    }
}

// Emit final rankings
async function calculateAndEmitResults(io, lobby) {
    console.log(`[Event] calculateAndEmitResults triggered. LobbyId: ${lobby._id.toString()}`);

    // Clear any active timers for this lobby
    if (activeTimers.has(lobby._id.toString())) {
        clearTimeout(activeTimers.get(lobby._id.toString()));
        activeTimers.delete(lobby._id.toString());
    }

    const rankedTeams = Object.entries(lobby.scores)
        .sort((a, b) => b[1] - a[1])
        .map(([team, score]) => ({ team, score }));

    console.log("[Event] Emitting final rankings:", rankedTeams);
    io.to(lobby._id.toString()).emit("quizEnded", {
        message: "Quiz has ended!",
        rankings: rankedTeams,
        scores: lobby.scores,
    });
}

// Start a timer for each question and send a 'timeUp' event when it expires
function startQuestionTimer(io, lobby,lobbyId, currentQuestionIndex, quiz) {
    console.log(`[Event] Starting timer for question ${currentQuestionIndex} in lobby ${lobbyId}`);

    const timer = setTimeout(() => {
        console.log(`[Event] Timer expired for lobbyId: ${lobbyId}. Sending 'timeUp' event.`);
        io.to(lobbyId).emit("timeUp", { message: "Time is up for this question!" });
        finalizeTeamAnswers(io,lobby, lobbyId, currentQuestionIndex); // Proceed to next question
    }, 20000); // Set the timeout to 20 seconds per question

    activeTimers.set(lobbyId, timer); // Store the timer for this lobby
}

module.exports = { setupQuizHandlers };
