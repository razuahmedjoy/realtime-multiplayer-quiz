import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { io } from "socket.io-client";



const QuizRoom = () => {
    const { lobbyId } = useParams();
    const location = useLocation();
    const [question, setQuestion] = useState(location.state?.question || null);

    const socket = io(import.meta.env.VITE_SOCKET_URL);
  
    useEffect(() => {
        
        // Listen for the next question
        socket.on("newQuestion", (nextQuestion) => {
            setQuestion(nextQuestion);
        });

        // Listen for quiz end
        socket.on("quizEnded", (data) => {
            alert(data.message);
        });

        return () => {
            socket.off("newQuestion");
            socket.off("quizEnded");
        };
    }, []);

    const submitAnswer = (answer) => {
        socket.emit("submitAnswer", { lobbyId, playerId: socket.id, answer });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {question ? (
                <>
                    <h1 className="text-2xl font-bold mb-4">{question.question}</h1>
                    <div className="grid grid-cols-2 gap-4">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                onClick={() => submitAnswer(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <h1 className="text-2xl font-bold">Waiting for the next question...</h1>
            )}
        </div>
    );
};

export default QuizRoom;
