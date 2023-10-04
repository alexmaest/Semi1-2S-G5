const commentModel = require('../models/publicationModel');
const loadController = require('./loadController');

class CommentController {
    constructor() {}

    async save(req, res) {
        try {
            const data = req.body;
            const comment = new commentModel(data.content, data.id_user, data.id_post);
            const commentAdded = await comment.save();
            if (!commentAdded) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Comment Created' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async translate(req, res) {
        try {
            const data = req.body;
            const comment = new commentModel(data.content, null, null);
            const response = await comment.translate(data.language);
            res.status(200).json({ message: 'Succesful request', data: response.TranslatedText });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getCommentPost(req, res) {
        try {
            const postId = req.params.id;
            const comment = new commentModel(null, null, null, postId);
            const response = await comment.getCommentPost();
            if (!response) {
                return res.status(500).json({ message: 'Internal Server Error' });
            } 
            res.status(200).json({ message: 'Succesful request', data: response });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new CommentController();
