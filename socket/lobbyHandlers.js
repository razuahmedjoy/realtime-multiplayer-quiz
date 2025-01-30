const Lobby = require("../server/models/Lobby");


const setupLobbyHandlers = (socket, io) => {

    // Create a new room
    socket.on("create_room", async ({ lobbyId }) => {
        socket.join(lobbyId);
        const lobby = await Lobby.findById(lobbyId);
        if (!lobby) {
            socket.emit("error", "Lobby not found");
            return;
        }
        io.to(lobbyId).emit("updatePlayers", lobby.players);
    });


    // Join a lobby
    socket.on("join_lobby", async ({ lobbyId, name, team }) => {
        try {
            const lobby = await Lobby.findById(lobbyId);
            if (!lobby) {
                socket.emit("error", "Lobby not found");
                return;
            }

            const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            const player = { playerId: socket.id, name, team, color };
            lobby.players.push(player);
            await lobby.save();

            socket.join(lobbyId);
            io.to(lobbyId).emit("updatePlayers", lobby.players);
        } catch (err) {
            console.log(err);
            socket.emit("error", "Failed to join room");
        }
    });
};

module.exports = { setupLobbyHandlers };
