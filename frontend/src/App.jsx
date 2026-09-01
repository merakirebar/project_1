import { useEffect, useState } from "react";

const API_URL = "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();

      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();

      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(task) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !task.completed
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Task Manager</h1>
        <p>Simple React + Node.js + PostgreSQL application</p>
      </header>

      <main className="container">
        <section className="card">
          <h2>Add Task</h2>

          <form onSubmit={addTask} className="task-form">
            <input
              type="text"
              placeholder="Enter a task..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </section>

        {error && <div className="error">{error}</div>}

        <section className="card">
          <div className="task-header">
            <h2>Tasks</h2>

            <button
              type="button"
              className="refresh-button"
              onClick={loadTasks}
            >
              Refresh
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="empty">
              <p>No tasks yet.</p>
              <span>Add your first task above.</span>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  className={`task ${
                    task.completed ? "completed" : ""
                  }`}
                  key={task.id}
                >
                  <div className="task-info">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />

                    <div>
                      <h3>{task.title}</h3>

                      <small>
                        {new Date(task.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
