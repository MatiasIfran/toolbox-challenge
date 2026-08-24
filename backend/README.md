# Backend API

REST API built with Node.js + Express that consumes an external API and reformats CSV file data as JSON.

## Requirements

- Node.js 14.x

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

The server listens on `http://localhost:3000` (fixed in `src/config/config.js` — the challenge requires the app to run without depending on environment variables).

## Test

```bash
npm test
```

Runs the test suite with Mocha + Chai.
