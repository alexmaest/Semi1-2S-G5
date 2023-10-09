const requestModel = require('../models/requestModel');
const userModel = require('../models/userModel');

class userController {
    constructor() { }

    async findUser(req, res) {
        try {
            const response = await userModel.findById(1);
            res.status(200).json({ message: 'User created', results: response });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async friendsAdded(req, res) {
        try {
            const userId = req.params.id;
            const user = new userModel(userId, null, null, null, null, null, null);
            const userExist = await user.getById();
            if (userExist){
                const friends = await user.getFriends();
                res.status(200).json({ friends: friends });
            } else {
                res.status(500).json({ message: 'The user doesn´t exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async friendsNotAdded(req, res) {
        try {
            const userId = req.params.id;
            const user = new userModel(userId, null, null, null, null, null, null);
            const userExist = await user.getById();
            if (userExist){
                const notFriends = await user.getNotFriends();
                res.status(200).json({ notFriends: notFriends });
            } else {
                res.status(500).json({ message: 'The user doesn´t exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async requestSend(req, res) {
        try {
            const { userId, friendId } = req.body;
            const request = new requestModel(null, userId, friendId);
            const requestExist = await request.getByUsersIds();
            if (requestExist){
                res.status(500).json({ message: 'The request already exist' });
            } else {
                const response = await request.save();
                res.status(200).json({ message: 'Friend request sent' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async requestAccepted(req, res) {
        try {
            const requestId = req.params.id;
            const request = new requestModel(requestId, null, null);
            const requestExist = await request.getById();
            if (requestExist){
                const response = await request.accept();
                if (response){
                    res.status(200).json({ message: 'Friend request accepted' });
                } else {
                    res.status(500).json({ message: 'The request was not sent' });
                }
            } else {
                res.status(500).json({ message: 'The request doesn´t exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async requestDenied(req, res) {
        try {
            const requestId = req.params.id;
            const request = new requestModel(requestId, null, null);
            const requestExist = await request.getById();
            if (requestExist){
                const response = await request.delete();
                if (response){
                    res.status(200).json({ message: 'Friend request denied' });
                } else {
                    res.status(500).json({ message: 'The request was not sent' });
                }
            } else {
                res.status(500).json({ message: 'The request doesn´t exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getRequestSent(req, res) {
        try {
            const userId = req.params.id;
            const user = new userModel(userId, null, null, null, null, null, null);
            const userExist = await user.getById();
            if (userExist){
                const request = new requestModel(null, userId, null);
                const requests = await request.getRequestSent();
                res.status(200).json({ requests: requests });
            } else {
                res.status(500).json({ message: 'The user doesn´t exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getRequestReceived(req, res) {
        try {
            const userId = req.params.id;
            const user = new userModel(userId, null, null, null, null, null, null);
            const userExist = await user.getById();
            if (userExist){
                const request = new requestModel(null, userId, null);
                const requests = await request.getRequestReceived();
                res.status(200).json({ requests: requests });
            } else {
                res.status(500).json({ message: 'The user doesn´t exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new userController();