import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import pool from "./db.js";
import routes from "./routes.js";

const app = express();

const PORT = Number(process.env.PORT || 5000);

app.use(helmet());

app.use(
  cors({
    origin: true
  })
);

app.use(express.json());


// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});


// API routes
app.use("/api", routes);


// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


// Start server
async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    process.exit(1);
  }
}

startServer();
