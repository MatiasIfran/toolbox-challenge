const express = require('express');
const filesService = require('../services/filesService');

const router = express.Router();

router.get('/data', async (req, res, next) => {
  try {
    const data = await filesService.getFilesData();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
