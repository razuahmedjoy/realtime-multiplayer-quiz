
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";

import { io } from "socket.io-client";


const LobbyLeader = () => {
    const { lobbyId } = useParams();

    const location = useLocation();
    const [players, setPlayers] = useState([]);
    const [question, setQuestion] = useState(null);
    const [quizEnded, setQuizEnded] = useState(false);
    const [rankings, setRankings] = useState([]);

    const data = location?.state?.data || null;

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

        console.log("Lobby ID:", lobbyId);

        socketRef.current.emit("create_room", { lobbyId }, (response) => {
            console.log("Response from server:", response); // Debug server acknowledgment
        });


        // Listen for updates to the player list
        socketRef.current.on("updatePlayers", (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socketRef.current.on("quizEnded", (data) => {
            setQuizEnded(true);
            // first set question null and then set rankings synchronously
            setQuestion(null);
            setRankings(data.rankings);
        });
        socketRef.current.on("error", (data) => {
            alert(data);
        });

        // Listen for "newQuestion" event
        socketRef.current.on("newQuestion", ({ currentQuestionIndex, quiz }) => {
            setQuestion(quiz);
            

        });



        return () => {

            socketRef.current.off("updatePlayers");
            socketRef.current.off("newQuestion");
            socketRef.current.off("quizEnded");
            socketRef.current.disconnect();


        };
    }, [lobbyId]);

    const handleStartQuiz = () => {

        // Emit "start-quiz" event to the server
        socketRef.current.emit("startQuiz", { lobbyId });


    }

    console.log(question)


    if (!data) return (
        <div className="bg-indigo-50 flex h-screen items-center justify-center flex-col space-y-6">
            <h1 className="text-xl text-center font-medium">Session Expired</h1>
            <button className="py-2 px-4 bg-red-400 text-white  rounded mt-2 cursor-pointer" onClick={() => window.location.href = "/"}>Go Home</button>
        </div>
    );

    const renderQuiz = () => {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4 text-center max-w-2xl text-indigo-600">{question.question}</h1>
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

    if (question) return renderQuiz();

    if(quizEnded) return renderRankings();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {data && (
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-center font-bold mb-4 text-5xl text-indigo-400">Scan to Join Quiz Room</h2>
                    <img src={data?.qrCode} alt="Room QR Code" className="w-60 h-60" />
                    <div>

                        <div className="flex flex-wrap justify-center mt-4">
                            {players?.map((player, index) => (
                                <div
                                    key={player.playerId}
                                    className="relative w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center m-1 text-white"
                                    style={{ zIndex: players.length - index, backgroundColor: `${player.color}` }}

                                >
                                    <span className="font-bold text-4xl align-middle flex items-center justify-center ">

                                        {player.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mx-auto max-w-md mt-6 text-center">
                            <button onClick={handleStartQuiz} className="py-3 px-8 rounded-full bg-indigo-600 text-white ">Start Quiz</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LobbyLeader;