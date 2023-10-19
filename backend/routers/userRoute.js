const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/id/:id', userController.findUserById);
router.get('/email/:email', userController.findUserByEmail);
// friends routes
router.get('/friends/added/:id', userController.friendsAdded);
router.get('/friends/notAdded/:id', userController.friendsNotAdded);

// requests routes
router.get('/requests/sent/:id', userController.getRequestSent);
router.get('/requests/received/:id', userController.getRequestReceived);

router.post('/request/send', userController.requestSend);
router.post('/request/accepted/:id', userController.requestAccepted);
router.post('/request/denied/:id', userController.requestDenied);

module.exports = router;