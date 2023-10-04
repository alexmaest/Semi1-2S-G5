const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/commentController');

router.post('/save', CommentController.save);
router.get('/post/:id', CommentController.getCommentPost);

module.exports = router;
