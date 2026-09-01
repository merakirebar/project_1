# Simple Task Manager

A simple full-stack Task Manager built with React, Node.js, Express and PostgreSQL.

Docker Compose is not used. The frontend, backend and database run as separate Docker containers.

## Technology

* React
* Vite
* Node.js
* Express
* PostgreSQL
* Nginx
* Docker

## Features

* Add task
* View tasks
* Mark task as completed
* Delete task
* PostgreSQL persistence
* REST API
* Dockerized frontend
* Dockerized backend
* Dockerized PostgreSQL

## Project Structure

```text
simple-task-app/
├── frontend/
├── backend/
├── database/
├── .gitignore
└── README.md
```

## Requirements

Install:

* Git
* Docker
* Node.js 22+ (optional for local development)

Check Docker:

```bash
docker --version
```

## 1. Create Docker Network

Create one network so the containers can communicate.

```bash
docker network create task-network
```

If it already exists, you can continue.

## 2. Build Database

From the project root:

```bash
docker build -t task-db ./database
```

## 3. Build Backend

```bash
docker build -t task-backend ./backend
```

## 4. Build Frontend

```bash
docker build -t task-frontend ./frontend
```

## 5. Start PostgreSQL

```bash
docker run -d \
  --name task-db \
  --network task-network \
  -e POSTGRES_DB=tasks \
  -e POSTGRES_USER=taskuser \
  -e POSTGRES_PASSWORD=taskpass \
  -p 5432:5432 \
  -v task-db-data:/var/lib/postgresql/data \
  task-db
```

Check the database container:

```bash
docker logs task-db
```

PostgreSQL is available at:

```text
localhost:5432
```

## 6. Start Backend

The backend connects to PostgreSQL using the Docker container name `task-db`.

```bash
docker run -d \
  --name task-backend \
  --network task-network \
  -e PORT=5000 \
  -e DB_HOST=task-db \
  -e DB_PORT=5432 \
  -e DB_NAME=tasks \
  -e DB_USER=taskuser \
  -e DB_PASSWORD=taskpass \
  -p 5000:5000 \
  task-backend
```

Check backend logs:

```bash
docker logs task-backend
```

Test the API:

```bash
curl http://localhost:5000/health
```

Expected result:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## 7. Start Frontend

```bash
docker run -d \
  --name task-frontend \
  --network task-network \
  -p 3000:80 \
  task-frontend
```

Open the application:

```text
http://localhost:3000
```

## Application Architecture

```text
                 Browser
                    |
                    v
          +-------------------+
          | React + Nginx     |
          | localhost:3000     |
          +---------+---------+
                    |
                    | /api
                    v
          +-------------------+
          | Node + Express    |
          | localhost:5000    |
          +---------+---------+
                    |
                    v
          +-------------------+
          | PostgreSQL        |
          | localhost:5432    |
          +-------------------+
```

Inside Docker, the connection is:

```text
frontend
    |
    | backend:5000
    v
backend
    |
    | task-db:5432
    v
database
```

## API Endpoints

### Health

```http
GET /health
```

### Get all tasks

```http
GET /api/tasks
```

### Create task

```http
POST /api/tasks
Content-Type: application/json
```

Request:

```json
{
  "title": "Learn Docker"
}
```

### Update task

```http
PUT /api/tasks/:id
Content-Type: application/json
```

Request:

```json
{
  "completed": true
}
```

### Delete task

```http
DELETE /api/tasks/:id
```

## Example API Commands

Get tasks:

```bash
curl http://localhost:5000/api/tasks
```

Create a task:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker"}'
```

Complete a task:

```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

Delete a task:

```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

## Stop Containers

```bash
docker stop task-frontend task-backend task-db
```

## Remove Containers

```bash
docker rm task-frontend task-backend task-db
```

## Start Existing Containers Again

```bash
docker start task-db
docker start task-backend
docker start task-frontend
```

## Rebuild After Code Changes

Backend:

```bash
docker build -t task-backend ./backend
```

Frontend:

```bash
docker build -t task-frontend ./frontend
```

Database:

```bash
docker build -t task-db ./database
```

Then recreate the corresponding containers.

## Reset Database

The PostgreSQL data is stored in the Docker volume:

```text
task-db-data
```

To completely reset the database:

```bash
docker stop task-db
docker rm task-db
docker volume rm task-db-data
```

Then start the database again:

```bash
docker run -d \
  --name task-db \
  --network task-network \
  -e POSTGRES_DB=tasks \
  -e POSTGRES_USER=taskuser \
  -e POSTGRES_PASSWORD=taskpass \
  -p 5432:5432 \
  -v task-db-data:/var/lib/postgresql/data \
  task-db
```

The `init.sql` script will run again.

## Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Vite will normally run on:

```text
http://localhost:5173
```

For local development, the frontend needs to access the backend directly or through a Vite proxy.

## Run Backend Locally

Make a `.env` file:

```text
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tasks
DB_USER=taskuser
DB_PASSWORD=taskpass
```

Then:

```bash
cd backend
npm install
npm run dev
```

## Git

Initialize Git:

```bash
git init
```

Check files:

```bash
git status
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial task manager application"
```

Add your repository:

```bash
git remote add origin YOUR_GIT_REPOSITORY_URL
```

Rename the branch:

```bash
git branch -M main
```

Push:

```bash
git push -u origin main
```

## Important

Do not commit `.env` files or passwords.

The `.gitignore` file already excludes environment files.

For production, use secure secrets instead of:

```text
taskpass
```

## License

MIT
