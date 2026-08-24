const express = require('express');
const { getFilesData } = require('../services/filesService');

const router = express.Router();

router.get('/data', async (req, res, next) => {
  try {
    const data = await getFilesData();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
