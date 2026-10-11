# Realtime Multiplayer Trivia Quiz

A team trivia game you play live. The host opens a room on a big screen. Players scan a QR code to join from their phones and pick a team (Red, Blue, Green or Yellow). Then everyone answers questions in real time against the clock.

## Features

### For the host
- **Built-in question sets.** The app comes with 7 sets: General Knowledge, Science & Nature, World Geography, History, Tech & Programming, Sports, and Movies & Pop Culture. They are stored as JSON files and loaded into MongoDB automatically.
- **Create your own quizzes.** The editor supports 2–4 options per question, a way to mark the correct answer, an optional timer for each question, and reordering.
- **Import and export JSON.** Upload a `.json` file to add a quiz, or download any quiz as JSON.
- **Duplicate built-in quizzes** to customise them. Built-in sets are read-only.
- **Room setup.** Choose a quiz, a room name, and the time per question (10–60 s).
- **Lobby.** Shows a QR code, a join link with a copy button, and players grouped by team. You can see who is online and remove players.
- **Live game screen.**
  - A countdown timer and a live "answered" counter.
  - **Reveal now** ends the timer early.
  - After each question, you see the answer breakdown, team scores and top players.
- **Results.** The winning team, team rankings and player rankings. **Play again** restarts with the same players.

### For players
- Join by QR code or link with a name and a team. No sign-up.
- Mobile-first answer buttons. Each answer has a colour and a shape, so you can tell them apart without colour.
- After each question you see whether you were right, the points you earned, the correct answer, your rank and the team standings.
- **Refresh-safe.** If you reload the page or lose connection, you rejoin automatically and keep your score.

### Game rules
- Each question has a timer. It ends early when every online player has answered.
- **Scoring.** A correct answer earns 100 points, plus a speed bonus of up to 100 (faster answers get more).
- **Team score** is the sum of its players' scores. The team with the highest total wins.

## Tech stack

| Part      | Technology |
| --------- | ---------- |
| Frontend  | React 18, Vite 6, React Router 7, TanStack Query 5 (server state), Zustand 5 (client state), Tailwind CSS 4, Socket.IO client, Axios, lucide-react (icons), sonner (toasts) |
| Backend   | Node.js, Express 4, Socket.IO 4, Mongoose 8, qrcode |
| Database  | MongoDB (e.g. MongoDB Atlas free tier) |

## Project structure

The backend uses a **modular (feature-based) architecture**, where each module owns its own layers. The frontend uses the **standard React layout**, with folders grouped by file type (pages, components, hooks, and so on).

### Backend (`server/`)

```
src/
  server.js                  Entry point: connect DB, seed quizzes, start HTTP + Socket.IO
  app.js                     Express app: middlewares, module routes, error handling
  config/                    env.js (all environment variables), database.js
  modules/
    quiz/
      quiz.model.js          Mongoose schema
      quiz.validator.js      Validates quiz input (editor + JSON import)
      quiz.service.js        Business logic: CRUD + built-in question sets
      quiz.controller.js     HTTP layer: request -> service -> response
      quiz.routes.js         /api/quizzes endpoints
      data/*.json            Built-in question sets
      index.js               What the module exposes to others
    lobby/
      lobby.model.js · lobby.service.js · lobby.controller.js · lobby.routes.js · index.js
    game/
      game.service.js        Live game state + rules (no Socket.IO inside)
      game.socket.js         Socket event handlers (the game's "controller")
      game.emitter.js        Everything sent to clients, in one place
      withGame.js            Handler wrapper: load game, check host, reply { ok } / { error }
      index.js
  shared/
    middlewares/             notFound, errorHandler
    utils/                   ApiError, asyncHandler
  scripts/seed.js            npm run seed
```

The request flow is **routes -> controller -> service -> model**. Modules talk to each other only through their `index.js`; for example, the lobby service uses `quizService` and the game service uses `lobbyService`.

### Frontend (`frontend/`)

```
src/
  main.jsx                   Mounts <AppProviders><App/></AppProviders>
  App.jsx                    Routes
  api/                       All HTTP calls (components never call axios directly)
    httpClient.js            Axios instance + error normalisation
    quizApi.js · lobbyApi.js
    queryKeys.js             TanStack Query cache keys
  components/
    common/                  Loading, Message, Timer, AnswerButton, Leaderboard, TeamScores, ConnectionBanner
    quiz/                    QuestionCard, QuizRow, QuizPicker, JsonFormatHelp
    host/                    HostWaiting, HostQuestion, HostReveal, HostResults
    player/                  JoinForm, PlayerWaiting, PlayerQuestion, PlayerReveal, PlayerResults
  config/queryClient.js      TanStack Query defaults
  constants/                 Teams, answer colours/shapes, time limits
  hooks/
    useQuizzes.js            useQuizzes, useQuiz, useCreateQuiz, useUpdateQuiz, useDeleteQuiz
    useLobby.js              useLobby, useCreateLobby
    useGameSocket.js         Socket lifecycle -> game store
    useHostGame.js           Host controls (start, reveal, next, end, restart, kick)
    usePlayerGame.js         Join / auto re-join / answer
  layouts/MainLayout.jsx     Header + page outlet
  pages/                     HomePage, QuizListPage, QuizEditorPage, HostGamePage, PlayerGamePage, NotFoundPage
  providers/AppProviders.jsx QueryClientProvider, Router, Toaster
  socket/                    socketClient (connect + emit with ack), socketEvents (event names)
  store/
    gameStore.js             Zustand: live game state (filled by socket events)
    sessionStore.js          Zustand + persist: host keys and player ids per room
  utils/                     helpers (cn, ordinal, downloadJson), quizForm (API <-> form)
```

**State management:**
- **REST data** (quizzes, room info) goes through **TanStack Query**. Components call hooks like `useQuizzes()` and never call axios directly. Mutations invalidate the cache, so lists refresh automatically.
- **Live game data** goes through **Zustand** (`gameStore`). The socket hook writes server events into the store, and components read only the slice they need.
- **Sessions** (which room you host or play in) are kept in a persisted Zustand store, which saves to localStorage. That's why a refresh doesn't kick you out.
- Form inputs remain local `useState`, because they're temporary UI state.

### How it works
- **REST (Express)** handles quizzes and rooms (`/api/quizzes`, `/api/lobbies`).
- **Socket.IO** handles everything live: joining, questions, answers and results.
- **Live game state is kept in server memory.** This covers players, answers and timers. Many players answering at once can't overwrite each other, and the timers stay accurate. Final results are saved to MongoDB when a game ends.
- **The server is the only source of truth.** Clients never receive the correct answer before the reveal. Answers are tied to the player's socket, so nobody can answer for someone else.
- **Host control is protected.** Creating a room returns a secret `hostKey`, stored in that browser. Only that browser can control the game.
- **Timers stay in sync.** Timers run on the server, and each device adjusts its countdown to the server clock.

## Run locally

Requirements: Node.js 18+ and a MongoDB database (local or Atlas).

```bash
# 1. Backend
cd server
cp .env.example .env      # then set MONGO_URI (Atlas, or mongodb://127.0.0.1:27017/quizapp for local MongoDB)
npm install
npm run dev               # http://localhost:3000 (built-in quizzes are seeded on first start)

# 2. Frontend (new terminal)
cd frontend
cp .env.example .env      # VITE_BACKEND_URL / VITE_SOCKET_URL = http://localhost:3000
npm install
npm run dev               # http://localhost:5173
```

To play with phones on the same Wi-Fi, open the frontend through your computer's network IP, which Vite prints. In `frontend/.env`, set `VITE_BACKEND_URL` and `VITE_SOCKET_URL` to that IP as well.

`npm run seed` (in `server/`) re-syncs the built-in quizzes after you edit the JSON files. Your own quizzes are never touched.

## Environment variables

**server/.env**

| Variable       | Description |
| -------------- | ----------- |
| `MONGO_URI`    | MongoDB connection string (required) |
| `FRONTEND_URL` | Public frontend URL, used in the join link and QR code. Optional: if empty, the request's origin is used. |
| `CORS_ORIGIN`  | Allowed frontend origins, comma-separated. If empty, all origins are allowed. |
| `PORT`         | Port to listen on (Railway sets this automatically) |

**frontend/.env**

| Variable           | Description |
| ------------------ | ----------- |
| `VITE_BACKEND_URL` | Backend URL, e.g. `https://your-app.up.railway.app` |
| `VITE_SOCKET_URL`  | Socket.IO URL (usually the same as above) |

## Deployment

**Backend → Railway** (Render or Fly.io work the same way; a `Dockerfile` and `fly.toml` are included)
1. Create a new Railway service from this repo and set the **root directory** to `server`.
2. Add `MONGO_URI`, `FRONTEND_URL` and, optionally, `CORS_ORIGIN`.
3. Railway runs `npm start` (`node src/server.js`), and the server listens on `PORT`.

> Run **one instance** of the backend. Live games are kept in memory, so they can't be split across several servers. If the server restarts, games in progress are lost. Quizzes and finished results stay in MongoDB.

**Frontend → Vercel** (or Netlify)
1. Import the repo and set the **root directory** to `frontend`. Vercel detects the Vite framework.
2. Set `VITE_BACKEND_URL` and `VITE_SOCKET_URL` to your Railway URL.
3. `frontend/vercel.json` (and `public/_redirects` for Netlify) makes routes like `/player/:id` work on refresh.

The Socket.IO server can't run on Vercel: Vercel functions are short-lived and can't keep WebSocket connections open. So the backend goes on Railway, and only the frontend goes on Vercel.

## Quiz JSON format

Used by **Import JSON**, **Export**, and the built-in files in `server/src/modules/quiz/data/`.

```json
{
  "name": "My Quiz",
  "description": "Optional",
  "category": "Optional",
  "questions": [
    {
      "question": "What is the capital of France?",
      "options": ["Paris", "London", "Berlin", "Madrid"],
      "answer": "Paris",
      "timeLimit": 20
    }
  ]
}
```

- `options`: 2–4 unique strings.
- `answer`: the correct option's text, or its zero-based index.
- `timeLimit` (optional): 5–120 seconds. If omitted, the room's time per question is used.

To add a built-in set, drop a JSON file in `server/src/modules/quiz/data/` and run `npm run seed`.

## API reference

**REST** (`/api`)

| Method | Path             | Description |
| ------ | ---------------- | ----------- |
| GET    | `/health`        | Health check |
| GET    | `/quizzes`       | List quizzes (name, description, question count) |
| GET    | `/quizzes/:id`   | Full quiz (editor and export) |
| POST   | `/quizzes`       | Create or import a quiz → `{ id }` |
| PUT    | `/quizzes/:id`   | Update a custom quiz |
| DELETE | `/quizzes/:id`   | Delete a custom quiz (204) |
| POST   | `/lobbies`       | `{ quizId, roomName, timeLimit }` → `{ id, hostKey }` |
| GET    | `/lobbies/:id`   | Room info, join URL and QR code |

Errors are always returned as `{ error: "message" }` with a matching HTTP status.

**Socket.IO events**

| Direction | Event | Payload |
| --------- | ----- | ------- |
| host → server | `hostJoin`, `startQuiz`, `revealAnswer`, `endQuiz`, `restartQuiz` | `{ lobbyId, hostKey }` |
| host → server | `nextQuestion` | `{ lobbyId, hostKey, index }` |
| host → server | `kickPlayer` | `{ lobbyId, hostKey, playerId }` |
| player → server | `joinLobby` | `{ lobbyId, name, team }`, or `{ lobbyId, playerId }` to rejoin |
| player → server | `submitAnswer` | `{ lobbyId, answer }` |
| server → all | `lobbyState` | players, teams, status |
| server → all | `newQuestion` | question, options, `endsAt` (no answer) |
| server → all | `answerProgress` | `{ answeredCount, playerCount }` |
| server → all | `questionEnded` | correct answer, counts, results, leaderboard, team scores |
| server → all | `quizEnded` | final leaderboard and team scores |
| server → player | `kicked` | |

Every client → server event replies through a Socket.IO acknowledgement, with `{ ok: true }` or `{ error }`.
