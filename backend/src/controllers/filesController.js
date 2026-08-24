const filesService = require('../services/filesService');

async function getFilesData(req, res, next) {
  try {
    const data = await filesService.getFilesData();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getFilesData };
