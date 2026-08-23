const EXPECTED_COLUMNS = 4;
const HEX_PATTERN = /^[0-9a-fA-F]{32}$/;

function parseLine(row) {
  const columns = row.split(',').map((value) => value.trim());

  if (columns.length !== EXPECTED_COLUMNS) {
    return null;
  }

  const [, text, rawNumber, hex] = columns;

  if (!text) {
    return null;
  }

  if (!rawNumber) {
    return null;
  }

  const number = Number(rawNumber);
  if (!Number.isFinite(number)) {
    return null;
  }

  if (!HEX_PATTERN.test(hex)) {
    return null;
  }

  return { text, number, hex };
}

function parseCsv(fileName, csvContent) {
  const rows = (csvContent || '')
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  const dataRows = rows.slice(1);

  const lines = dataRows
    .map(parseLine)
    .filter((line) => line !== null);

  return { file: fileName, lines };
}

module.exports = { parseCsv };
