const filesService = require('../services/filesService')

async function getFilesList (req, res, next) {
  try {
    const files = await filesService.getFilesList()
    res.json({ files })
  } catch (err) {
    next(err)
  }
}

async function getFilesData (req, res, next) {
  try {
    const { fileName } = req.query
    const data = await filesService.getFilesData(fileName)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

module.exports = { getFilesList, getFilesData }
