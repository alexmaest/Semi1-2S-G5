const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController');

router.post('/', registerController.register);
router.post('/confirm', registerController.confirmSignUp);

module.exports = router;