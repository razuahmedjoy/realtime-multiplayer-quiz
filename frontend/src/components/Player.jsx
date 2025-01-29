import useLoadingStore from "@/store/useLoadingStore";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import { io } from "socket.io-client";
import LoadingSpinner from "./Loading";

const Player = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [team, setTeam] = useState("");
    const { loading, setLoading } = useLoadingStore();
    const [players, setPlayers] = useState([]);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [quizEnded, setQuizEnded] = useState(false);
    const [rankings, setRankings] = useState([]);

    const { lobbyId } = useParams();
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io("wss://server-broken-night-5589.fly.dev"); // Replace with your server URL

        // Cleanup socket connection on component unmount
        return () => {
            socketRef.current.disconnect();
        };
    }, []);


    useEffect(() => {
        if (socketRef.current) {
            // Listen for updates to the player list
            socketRef.current.on("updatePlayers", (updatedPlayers) => {
                setPlayers(updatedPlayers);
                setLoading(false);
            });

            // Listen for "newQuestion" event
            socketRef.current.on("newQuestion", ({ currentQuestionIndex, quiz }) => {
                setQuestion(quiz);
                setCurrentQuestion(currentQuestionIndex);
                setAnswer("");
            });

          
            socketRef.current.on("players", (data) => {
                console.log(data);
            })

            socketRef.current.on("quizEnded", (data) => {
                setQuizEnded(true);
                setRankings(data.rankings);
            });
        

            // Optional: Handle socket disconnect
            socketRef.current.on("disconnect", () => {
                console.log("Socket disconnected");
            });
        }
    }, []);

    const handleJoin = () => {
        if (!name || !team) {
            alert("Please enter your name and select a team.");
            return;
        }
        setLoading(true);


        // Emit "join-room" event to the server
        socketRef.current.emit("join_lobby", { lobbyId, name, team });


    };


    const handleSubmitAnswer = (answer) => {

        console.log(answer)
        // Emit "submitAnswer" event to the server
        socketRef.current.emit("submitAnswer", { lobbyId: lobbyId, playerId: socketRef.current.id, answer, currentQuestion: (currentQuestion) });
        setAnswer(answer);


    };
    const renderJoinRoom = () => {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h1 className="text-2xl font-bold mb-4">Join the Room</h1>

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 mb-4 w-full max-w-xs rounded"
                />

                <div className="mb-4">
                    <button
                        className={`px-4 py-2 rounded mr-2 ${team === "red" ? "bg-red-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setTeam("red")}
                    >
                        Red
                    </button>
                    <button
                        className={`px-4 py-2 rounded mr-2 ${team === "blue" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setTeam("blue")}
                    >
                        Blue
                    </button>
                    <button
                        className={`px-4 py-2 rounded mr-2 ${team === "green" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setTeam("green")}
                    >
                        Green
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${team === "yellow" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setTeam("yellow")}
                    >
                        Yellow
                    </button>
                </div>
                {
                    loading ? <LoadingSpinner /> : <button onClick={handleJoin} className="px-6 py-2 bg-indigo-600 text-white rounded-full mt-5">Join Room</button>
                }
            </div>
        );
    };

    const renderWaitingRoom = () => {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl text-indigo-500 font-bold mb-4 text-center">Waiting to Start</h1>
                <p className="text-center text-muted">{players.length} players have joined</p>
                <div className="relative border border-indigo-400 w-lg h-[350px] max-h-[450px] rounded-md max-w-lg mt-5 p-5">
                    <style>
                        {`
            @keyframes float {
              0% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-20px);
              }
              100% {
                transform: translateY(0);
              }
            }

            .floating {
              animation: float 3s ease-in-out infinite;
            }
          `}
                    </style>
                    {players?.map((player, index) => (
                        <div
                            key={player.playerId}
                            className="absolute w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center m-1 text-white floating"
                            style={{
                                zIndex: players.length - index,
                                backgroundColor: `${player.color}`,
                                top: `${Math.random() * 80 + 10}%`,
                                left: `${Math.random() * 80 + 10}%`,
                            }}
                        >
                            <span className="font-bold text-4xl align-middle flex items-center justify-center">
                                {player.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderRankings = () => {
        return (
            quizEnded && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center mt-6">
                    <h2 className="text-2xl font-bold mb-4">Final Rankings</h2>
                    {rankings.map((team, index) => (
                        <p key={team.team} className="text-lg">
                            🏆 {index + 1}. {team.team} - {team.score} points
                        </p>
                    ))}
                </div>
            )
        )
    };

    const renderQuiz = () => {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">{question.question}</h1>
                <div className="grid grid-cols-2 gap-4">
                    {question.options.map((option, index) => (
                        <button
                            disabled={answer}
                            key={index}
                            className={`bg-indigo-500 ${answer && answer === option && 'bg-indigo-800'} text-white py-2 px-4 rounded-lg ${answer && '!cursor-not-allowed'}`}
                            onClick={() => handleSubmitAnswer(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return <LoadingSpinner />;
    if(quizEnded) return renderRankings();
    if (question) return renderQuiz();
    if (players.length) return renderWaitingRoom();
    return renderJoinRoom();
};

export default Player;
