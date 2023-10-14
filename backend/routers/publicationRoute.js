const express = require('express');
const router = express.Router();

const PublicationController = require('../controllers/publicationController');

router.post('/save', PublicationController.save);
router.get('/friendsPosts/:id', PublicationController.getFriendPosts);
router.get('/user/:id', PublicationController.getUserPosts);

module.exports = router;
