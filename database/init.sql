CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    completed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX IF NOT EXISTS idx_tasks_created_at
ON tasks(created_at);


INSERT INTO tasks (title, completed)
VALUES
    ('Learn React', false),
    ('Build Node.js API', false),
    ('Connect PostgreSQL', true)
ON CONFLICT DO NOTHING;
