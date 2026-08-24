const express = require('express');
const filesController = require('../controllers/filesController');

const router = express.Router();

router.get('/data', filesController.getFilesData);

module.exports = router;
