
# Sportz ⚽🏀 — Match Data & Live Commentary Server

A lightweight Node.js server that serves match data and real-time commentary over HTTP and WebSocket. Built with Express, `ws`, and Drizzle ORM for easy local development and seeding.

🌟 Highlights
- Real-time match commentary via WebSocket
- REST endpoints for match data
- Simple SQLite/Postgres-ready schema using Drizzle
- Seed scripts to populate sample data

Quick links
- `src/index.js` — app entry
- `src/routes/matches.js` — matches API
- `src/routes/commentary.js` — commentary API
- `ws/server.js` — WebSocket server
- `src/seed/seed.js` — seed data loader

Getting started 🚀

Prerequisites
- Node.js 18+ (or compatible)

Install

```bash
npm install
```

Seed the database (adds example matches and commentary)

```bash
npm run seed
```

Run the server

```bash
npm start
```

Development

- Use `npm run dev` to start with automatic reloads.
- Database migrations and studio are available via `drizzle-kit` scripts in `package.json`.

Project Structure 🗂️

- `src/` — main server source
	- `index.js` — server bootstrap
	- `db/` — database helpers and schema
	- `routes/` — HTTP route handlers (`matches`, `commentary`)
	- `seed/` — seed scripts
- `ws/` — WebSocket server implementation
- `drizzle/` — SQL migrations and snapshots

How to use the API

- GET `/matches` — list matches
- GET `/matches/:id` — match details
- POST `/commentary` — add commentary (used internally or by admin tools)

WebSocket

The WebSocket server broadcasts live commentary updates to connected clients. Check `ws/server.js` for connection details and event names.

Contributing 🤝

PRs and issues are welcome. Please follow the project's simple style and add tests for new behavior where applicable.

License

MIT

