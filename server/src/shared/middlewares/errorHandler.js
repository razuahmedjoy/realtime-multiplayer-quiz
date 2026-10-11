// Turns any thrown error into a JSON response: { error: "message" }.
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ error: err.message });
  if (err.name === "ValidationError") return res.status(400).json({ error: err.message });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON body" });

  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
};
