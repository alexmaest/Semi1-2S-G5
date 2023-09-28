const userModel = require('../models/userModel');

class LoginController {
    constructor() { }

    async usersLogin(req, res) {
        try {
            const searchId = 1;
            const user = new userModel(searchId, null, null, null, null, null, null);
            const response = await user.getById();
            res.status(200).json({ message: 'Succesful request' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async passwordSend(req, res) {
        try {
            res.status(200).json({ message: 'Succesful request' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async passwordUpdate(req, res) {
        try {
            res.status(200).json({ message: 'Succesful request' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new LoginController();