import express from "express";
import pool from "./db.js";

const router = express.Router();


// GET /api/tasks
router.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, completed, created_at
      FROM tasks
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get tasks"
    });
  }
});


// POST /api/tasks
router.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO tasks (title)
      VALUES ($1)
      RETURNING id, title, completed, created_at
      `,
      [title.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create task"
    });
  }
});


// PUT /api/tasks/:id
router.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Completed must be true or false"
      });
    }

    const result = await pool.query(
      `
      UPDATE tasks
      SET completed = $1
      WHERE id = $2
      RETURNING id, title, completed, created_at
      `,
      [completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task"
    });
  }
});


// DELETE /api/tasks/:id
router.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task"
    });
  }
});

export default router;
