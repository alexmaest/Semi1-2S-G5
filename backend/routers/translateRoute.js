const express = require('express');
const router = express.Router();

const TranslateController = require('../controllers/translateController');

router.post('/', TranslateController.translate);
router.get('/listLanguage', TranslateController.getListLanguages);

module.exports = router;
