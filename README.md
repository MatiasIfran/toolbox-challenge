# Toolbox Challenge

Full Stack JS code challenge: a Node.js/Express API that consumes an external file-listing API, reformats CSV file contents into JSON, and a React frontend that displays that data in a table.

## What it does

1. An external API (provided, not built here) exposes a list of CSV files and lets you download each one.
2. The backend (`backend/`) calls that external API, downloads each file, parses and validates its CSV content, and exposes the result as JSON through `GET /files/data`.
3. The frontend (`frontend/`) consumes `GET /files/data` and renders it as a table.

## Project structure

```
.
├── backend/     Node.js + Express API (Node 14)
│   ├── src/
│   │   ├── config/       hardcoded app configuration (no env vars)
│   │   ├── controllers/  request/response handling
│   │   ├── routes/       Express route wiring
│   │   └── services/     business logic (external API client, CSV parser, orchestration)
│   └── test/     Mocha + Chai + Sinon + Supertest + Nock
└── frontend/    React + React Bootstrap app (Node 16)
    └── src/
        ├── components/   FilesTable, FileNameFilter
        ├── store/        Redux Toolkit slice and store
        └── services/     API client (fetch)
```

## Requirements

Either Docker, or Node.js if running the two parts locally:

- **Backend**: Node.js 14.x
- **Frontend**: Node.js 16.x

Since the two parts target different Node versions, use a version manager (e.g. [nvm-windows](https://github.com/coreybutler/nvm-windows) on Windows, or [nvm](https://github.com/nvm-sh/nvm) on macOS/Linux) to switch between them per terminal.

## Running the app

### Option A — with Docker

No Node install needed — just Docker.

```bash
docker compose up --build
```

This builds and starts both services:
- Backend (`node:14-alpine`) on `http://localhost:3000`
- Frontend built with `npm run build` and served by `nginx:1.27-alpine` on `http://localhost:3001`

Stop with `docker compose down`.

### Option B — locally with Node

```bash
# Terminal 1 — backend (Node 14)
cd backend
npm install
npm start
# -> http://localhost:3000

# Terminal 2 — frontend (Node 16)
cd frontend
npm install
npm start
# -> http://localhost:3001
```

Either way, open `http://localhost:3001` in the browser once both services are running.

## Tests

```bash
cd backend
npm test    # Mocha + Chai + Sinon + Supertest + Nock

cd frontend
npm test    # React Testing Library
```

## Ports

| Service  | Port | Why |
|----------|------|-----|
| Backend  | 3000 | fixed in `backend/src/config/config.js` |
| Frontend | 3001 | fixed in `frontend/package.json`'s `start` script, kept off 3000 to avoid clashing with the backend |

## Endpoints

| Method | Path          | Description |
|--------|---------------|--------------|
| GET    | `/`           | Health check |
| GET    | `/files/list` | Raw passthrough of the external API's file list, returns `{ files: [...] }` |
| GET    | `/files/data` | Downloads and parses every file from the external API, returns `[{ file, lines: [{ text, number, hex }] }]`. Accepts an optional `?fileName=` query param to fetch/parse a single file instead of the whole list |

## Key technical decisions

- **No environment variables or global config**: the challenge requires the code to run without depending on env vars or OS-specific setup. The backend's port and the external API URL/key are hardcoded in `backend/src/config/config.js`; the frontend's API base URL is hardcoded in `frontend/src/config.js`, and its dev server port is fixed in the `start` script in `frontend/package.json`. None of it is read from `process.env` at the application level.
- **CORS**: the backend enables CORS (`cors` middleware) since the frontend dev server runs on a different origin (port) than the API.
- **Retry with backoff**: `externalApiService.downloadFile` retries up to 3 attempts (250ms → 500ms exponential backoff) on network errors, `408`, `429` and `5xx` responses. `4xx` errors other than `408`/`429` fail immediately, since retrying them wouldn't change the outcome.
- **Per-file error isolation**: if a single file fails to download (even after retries), it's skipped and the rest of the files are still processed — one bad file doesn't take down the whole `/files/data` response. An invalid CSV *line* within a file is discarded the same way (see CSV validation below), while the file's other valid lines are kept. An *unexpected* error thrown while parsing (a real bug, not a validation failure), or a failure listing the files themselves (`listFiles()`), is not recoverable and propagates as a 500.
- **CSV validation**: a line is discarded if it doesn't have exactly 4 columns, if `text` or `number` is empty, if `number` isn't a finite number, or if `hex` isn't a 32-character hex string. Empty files or files with no valid lines are returned as `{ file, lines: [] }`, not treated as errors.
- **Layered backend**: `routes` (wiring) → `controllers` (request/response) → `services` (business logic), to keep route handlers thin as more endpoints/params get added.

## Optional features implemented

_(updated as optional branches land)_

- [x] `GET /files/list`
- [x] `?fileName=` filter on `/files/data`
- [x] StandardJS
- [x] Redux
- [x] Jest unit tests (frontend)
- [x] fileName filter dropdown (frontend)
- [x] Docker / Docker Compose
