// Central place for configuration read from environment variables.
require("dotenv").config();

const list = (value) => (value ? value.split(",").map((v) => v.trim()).filter(Boolean) : null);

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI,
  frontendUrl: (process.env.FRONTEND_URL || "").replace(/\/$/, ""),
  corsOrigin: list(process.env.CORS_ORIGIN) || "*",
};
