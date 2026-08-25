# Frontend

React app built with Create React App (Webpack + Babel) and React Bootstrap, that consumes the backend's `GET /files/data` and `GET /files/list` endpoints.

## Requirements

- Node.js 16.x

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

The dev server listens on `http://localhost:3001` (kept off port 3000 so it doesn't clash with the backend API). The backend must be running at `http://localhost:3000` for the app to load any data.

## Build

```bash
npm run build
```

## Test

```bash
npm test
```
