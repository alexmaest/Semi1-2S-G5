const express = require('express');
const router = express.Router();

const PublicationController = require('../controllers/publicationController');

router.post('/save', PublicationController.save);
router.get('/allUsers', PublicationController.getAllPosts);
router.get('/user/:id', PublicationController.getUserPosts);

module.exports = router;
