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
}

module.exports = new userController();