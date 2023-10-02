const express = require('express');
const router = express.Router();

const PublicationController = require('../controllers/publicationController');

router.post('/save', PublicationController.save);
router.post('/translate', PublicationController.translate);

module.exports = router;
