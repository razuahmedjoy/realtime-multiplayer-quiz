import useSocket from "@/hooks/useSocket";
import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router";

const LobbyLeader = () => {
    const { lobbyId } = useParams();
    const location = useLocation();
    const [players, setPlayers] = useState([]);
    const [question, setQuestion] = useState(null);
    const [quizEnded, setQuizEnded] = useState(false);
    const [rankings, setRankings] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20);

    const timerRef = useRef(null); // Store the timer reference to prevent multiple intervals

    const { createRoom, on, off, emit } = useSocket();
    const data = location?.state?.data || null;
   
    const currentUrlWithProtocol = `${window.location.protocol}//${window.location.hostname}`;
    const currentUrlWithProtocolAndPort = window.location.hostname === "localhost"
        ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
        : currentUrlWithProtocol;


    useEffect(() => {
        if (!lobbyId) return;

        createRoom(lobbyId);

        on("updatePlayers", (updatedPlayers) => setPlayers(updatedPlayers));

        on("newQuestion", ({ quiz, timeLimit }) => {
            if (quizEnded) return; // Prevent showing questions after the quiz ends

            
            setQuestion(quiz);
            setTimeLeft(timeLimit);

            // Clear any previous interval before starting a new one
            if (timerRef.current) clearInterval(timerRef.current);

            // Start countdown
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        });

        on("timeUp", () => {
            clearInterval(timerRef.current);
            setTimeLeft(0);
        });

        on("quizEnded", (data) => {
            if (timerRef.current) clearInterval(timerRef.current);
            setQuizEnded(true);
            setQuestion(null);
            setRankings(data.rankings || []); 
        });

        on("error", (data) => alert(data));

        return () => {
            off("updatePlayers");
            off("newQuestion");
            off("timeUp");
            off("quizEnded");
            off("error");

            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [lobbyId,quizEnded]);

    const handleStartQuiz = () => {
        setQuizEnded(false); // Reset quiz state before starting
        setRankings([]); // Clear previous rankings
        emit("startQuiz", { lobbyId });
    };

    if (!data) return (
        <div className="bg-indigo-50 flex h-screen items-center justify-center flex-col space-y-6">
            <h1 className="text-xl text-center font-medium">Session Expired</h1>
            <button className="py-2 px-4 bg-red-400 text-white rounded mt-2 cursor-pointer" onClick={() => window.location.href = "/"}>Go Home</button>
        </div>
    );

    const renderQuiz = () => (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4 text-center max-w-2xl text-indigo-600">{question.question}</h1>
            <div className="text-2xl font-bold text-red-500 mt-4">Time Left: {timeLeft}s</div>
        </div>
    );

    const renderRankings = () => (
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
    );

    if (question) return renderQuiz();
    if (quizEnded) return renderRankings();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {data && (
                
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-center font-bold mb-4 text-5xl text-indigo-400">Scan to Join Quiz Room</h2>
                    <img src={data?.qrCode} alt="Room QR Code" className="w-60 h-60" />
                    <p className="text-centertext-sm mt-4">
                        Or join at <strong><a className=" text-indigo-400 " href={`${currentUrlWithProtocolAndPort}/player/${lobbyId}`} target="_blank" rel="noopener noreferrer">{`${currentUrlWithProtocolAndPort}/player/${lobbyId}`}</a></strong>
                    </p>
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
