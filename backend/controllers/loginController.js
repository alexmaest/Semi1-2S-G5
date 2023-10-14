const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const cognitoService = require('../services/cognitoService');
class LoginController {
    constructor() { }

    async usersLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = new userModel(null, null, null, null, email, password, null);
            const userByEmail = await user.getByEmail();
            if (!userByEmail) {
                res.status(501).json({ message: 'Account with that email not exist' });
            } else {
                const cognito = new cognitoService();
                const result = await cognito.signInUser(email, password);
                if (result.success) {
                    const token = jwt.sign({ email, password }, process.env.AUTH_KEY, { expiresIn: '1h' });
                    res.status(200).json({ id_User: userByEmail.id_User, token: token, message: 'Successful request' });
                } else {
                    res.status(501).json({ message: result.data });
                }
            }
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