// Wraps a socket event handler: loads the game, optionally checks the host key,
// and always answers the client's acknowledgement with { ok, ...data } or { error }.
const gameService = require("./game.service");

const withGame =
  (handler, { hostOnly = false } = {}) =>
  async (data = {}, ack) => {
    const reply = typeof ack === "function" ? ack : () => {};
    try {
      const game = await gameService.getGame(data.lobbyId);
      if (hostOnly) gameService.assertHost(game, data.hostKey);
      const result = await handler(game, data);
      reply({ ok: true, ...result });
    } catch (err) {
      if (!err.status) console.error("[socket]", err);
      reply({ error: err.status ? err.message : "Something went wrong" });
    }
  };

module.exports = withGame;
