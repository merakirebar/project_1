import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "tasks",
  user: process.env.DB_USER || "taskuser",
  password: process.env.DB_PASSWORD || "taskpass"
});

pool.on("error", (error) => {
  console.error("PostgreSQL error:", error);
});

export default pool;
