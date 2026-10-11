// HTTP layer for lobbies.
const lobbyService = require("./lobby.service");

const create = async (req, res) => {
  const lobby = await lobbyService.createLobby(req.body);
  // hostKey is only ever returned here, to the browser that created the room
  res.status(201).json({ id: lobby._id, hostKey: lobby.hostKey });
};

const getById = async (req, res) => {
  res.json(await lobbyService.getLobbyInfo(req.params.id, req.get("origin")));
};

module.exports = { create, getById };
