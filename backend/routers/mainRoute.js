const express = require('express');
const router = express.Router();
const authenticateToken = require('../services/authMiddleware');

const mainController = require('../controllers/mainController');

router.get('/', mainController.index);
router.get('/prueba', authenticateToken, mainController.index);

module.exports = router;
