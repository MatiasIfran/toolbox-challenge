const { listFiles, downloadFile } = require('./externalApiService');
const { parseCsv } = require('./csvParserService');

async function getFilesData() {
  const files = await listFiles();

  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const csvContent = await downloadFile(file);
        return parseCsv(file, csvContent);
      } catch (err) {
        console.error(`Skipping file "${file}": ${err.message}`);
        return null;
      }
    })
  );

  return results.filter((result) => result !== null);
}

module.exports = { getFilesData };
