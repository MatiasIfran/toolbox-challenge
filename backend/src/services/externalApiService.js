const fetch = require('node-fetch');
const { EXTERNAL_API_BASE_URL, EXTERNAL_API_KEY } = require('../config/config');

const AUTH_HEADER = `Bearer ${EXTERNAL_API_KEY}`;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 250;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return status === 408 || status === 429 || status >= 500;
}

async function listFiles() {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/v1/secret/files`, {
    headers: { authorization: AUTH_HEADER }
  });

  if (!response.ok) {
    throw new Error(`Failed to list files: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.files;
}

async function downloadFile(fileName, attempt = 1) {
  let response;

  try {
    response = await fetch(`${EXTERNAL_API_BASE_URL}/v1/secret/file/${encodeURIComponent(fileName)}`, {
      headers: { authorization: AUTH_HEADER }
    });
  } catch (err) {
    if (attempt >= MAX_ATTEMPTS) {
      throw new Error(`Failed to download file "${fileName}": ${err.message}`);
    }
    await delay(RETRY_DELAY_MS * 2 ** (attempt - 1));
    return downloadFile(fileName, attempt + 1);
  }

  if (!response.ok) {
    if (isRetryableStatus(response.status) && attempt < MAX_ATTEMPTS) {
      await delay(RETRY_DELAY_MS * 2 ** (attempt - 1));
      return downloadFile(fileName, attempt + 1);
    }
    throw new Error(`Failed to download file "${fileName}": ${response.status} ${response.statusText}`);
  }

  return response.text();
}

module.exports = { listFiles, downloadFile };
