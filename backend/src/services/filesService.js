const externalApiService = require('./externalApiService');
const csvParserService = require('./csvParserService');

async function getFilesList() {
  return externalApiService.listFiles();
}

async function getFilesData() {
  const files = await externalApiService.listFiles();

  const results = await Promise.all(
    files.map(async (file) => {
      let csvContent;
      try {
        csvContent = await externalApiService.downloadFile(file);
      } catch (err) {
        console.error(`Skipping file "${file}": ${err.message}`);
        return null;
      }
      return csvParserService.parseCsv(file, csvContent);
    })
  );

  return results.filter((result) => result !== null);
}

module.exports = { getFilesList, getFilesData };
