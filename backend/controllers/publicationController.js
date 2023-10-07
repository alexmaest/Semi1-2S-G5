const publicationModel = require('../models/publicationModel');
const loadController = require('./loadController');

class PublicationController {
    constructor() {}

    async save(req, res) {
        try {
            const data = req.body;
            const imageUrl = await loadController.uploadImage(data.image);
            if (!imageUrl) {
                 return res.status(500).json({ message: 'Internal Server Error' });
            }
            const publication = new publicationModel(data.description, imageUrl, data.date, data.id_user);
            const postAdded = await publication.save();
            if (!postAdded) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Post Created', result: postAdded });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getFriendPosts(req, res) {
        try {
            const userId = req.params.id;
            const publication = new publicationModel(null, null, null, userId);
            const posts = await publication.getFriendPosts();
            if (!posts) {
                return res.status(500).json({ message: 'Internal Server Error' });
            } 
            res.status(200).json({ message: 'Succesful request', data: posts });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getUserPosts(req, res) {
        try {
            const userId = req.params.id;
            const publication = new publicationModel(null, null, null, userId);
            const posts = await publication.getUserPosts();
            if (!posts) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Succesful request', data: posts });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new PublicationController();
