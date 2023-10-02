const publicationModel = require('../models/publicationModel');

class PublicationController {
    constructor() {}

    async save(req, res) {
        try {
            const data = req.body;
            const publication = new publicationModel(data.description, data.image, data.date, data.id_user);
            const response = await publication.save();
            res.status(200).json({ message: 'Succesful request' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async translate(req, res) {
        try {
            const data = req.body;
            const publication = new publicationModel(data.description, null, null, null);
            const response = await publication.translate(data.language);
            res.status(200).json({ message: 'Succesful request', data: response.TranslatedText });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new PublicationController();
