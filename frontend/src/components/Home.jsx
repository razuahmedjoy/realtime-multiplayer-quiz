import axios from "@/config/axiosConfig";
import useLoadingStore from "@/store/useLoadingStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LoadingSpinner from "./Loading";

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState("");
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();
    const {loading} = useLoadingStore();



    const handleCreateLobby = async () => {
        if (!selectedQuizId) {
            alert("Please select a quiz");
            return;
        }
        if(!roomName){
            alert("Please enter a room name");
            return;
        }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/lobby/create`, {
            quizId: selectedQuizId
        });
        const data = response.data;

        navigate(`/lobby-leader/${data.lobbyId}`, { state: { data: data } });
        // navigate(`/lobby-leader/${data.lobbyId}?qrCode=${data.qrCode}`);
    };


    // Fetch quizzes from the backend
    useEffect(() => {
        const fetchQuizzes = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/all`);
            const data = response.data;
            setQuizzes(data);
        };
        fetchQuizzes();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="h-screen flex items-center justify-center flex-col space-y-20 bg-indigo-50">
            <div className="w-2xl max-w-xl border p-4 rounded border-indigo-400 shadow-2xl shadow-violet-100 flex flex-col h-[650px] max-h-[450px] items-center bg-white">
                <h1 className="text-5xl text-indigo-600 font-medium">Trivia Game</h1>
                <div className="flex gap-4 mt-20 mb-8">
                    <select className="p-3 border rounded border-indigo-300 cursor-pointer" onChange={(e) => setSelectedQuizId(e.target.value)}>
                        <option value="">Select a quiz</option>
                        {quizzes.map((quiz) => (
                            <option key={quiz._id} value={quiz._id}>
                                {quiz.name}
                            </option>
                        ))}
                    </select>
                    <div>
                        <input value={roomName} onChange={(e)=>setRoomName(e.target.value)} type="text" className="p-3 rounded border border-indigo-300 cursor-pointer" placeholder="Enter Room Name" />
                    </div>
                </div>
                <button className="py-3 px-8 bg-indigo-500 text-white  rounded mt-2 cursor-pointer" onClick={handleCreateLobby}>Create Lobby</button>

            </div>

        </div>
    );
};

export default Home;