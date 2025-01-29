import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { io } from "socket.io-client";



const WaitingRoom = () => {
    const { lobbyId } = useParams();
    const location = useLocation();
    const player = location.state?.player || [];
    const socket = location.state?.socket || null;
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if (!socket) return;

        // Listen for updates to the player list
        socket.on("updatePlayers", (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        // Listen for quiz start
        socket.on("newQuestion", (question) => {
            navigate(`/quiz-room/${lobbyId}`, { state: { question } });
        });

        return () => {
            socket.off("self-joined");
            socket.disconnect();
        };
    }, [lobbyId, navigate, socket]);

    console.log("Player:", player);
    console.log("Players:", players);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Waiting to Start</h1>
            <div className="relative w-full h-96 bg-white shadow-lg rounded-lg overflow-hidden">
                {players.map((player, index) => (
                    <div
                        key={index}
                        className="absolute rounded-full bg-blue-500 text-white flex items-center justify-center w-16 h-16"
                        style={{
                            top: `${Math.random() * 70 + 10}%`,
                            left: `${Math.random() * 70 + 10}%`,
                        }}
                    >
                        {player.name[0]}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WaitingRoom;
