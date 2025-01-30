import { useRef, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Connect the socket
        socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

        return () => {
            // Cleanup on unmount
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const createRoom = (lobbyId) => {
        if (!socketRef.current) return;
        socketRef.current.emit("create_room", { lobbyId });
    };

    const on = (event, callback) => {
        if (!socketRef.current) return;
        socketRef.current.on(event, callback);
        console.log(event)
    };

    const off = (event) => {
        if (!socketRef.current) return;
        socketRef.current.off(event);
    };

    const emit = (event, data) => {
        if (!socketRef.current) return;
        socketRef.current.emit(event, data);
    };

    return {
        createRoom,
        on,
        off,
        emit,
    };
};

export default useSocket;