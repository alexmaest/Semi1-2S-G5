const requestModel = require('../models/requestModel');
const userModel = require('../models/userModel');
const chatBotModel = require('../models/chatBotModel');
const cognitoService = require('../services/cognitoService');
const loadController = require('./loadController');

class userController {
    constructor() { }

    async findUserById(req, res) {
        try {
            const id = req.params.id;
            const user = new userModel(id, null, null, null, null, null, null);
            const userById = await user.getById();
            if (userById) {
                res.status(200).json({ user: userById });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async findUserByEmail(req, res) {
        try {
            const email = req.params.email;
            const user = new userModel(null, null, null, null, email, null, null);
            const userByEmail = await user.getByEmail();
            if (userByEmail) {
                res.status(200).json({ user: userByEmail });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id_user, firstName, lastName, dpi, email, password, profilePhoto } = req.body;
            const user = new userModel(id_user, firstName, lastName, dpi, email, password, null);
            //Cambios para recibir base64 en la imagen de perfil
            if (profilePhoto != null) {
                const imageUrl = await loadController.uploadImage(profilePhoto);
                if (imageUrl) {
                    user.profilePhoto = imageUrl;
                }
            } else {
                user.profilePhoto = profilePhoto;
            }

            const cognito = new cognitoService();
            const cognitoResponse = await cognito.updateUserAttributes(email, [
                {
                    Name: 'picture',
                    Value: user.profilePhoto
                },
                {
                    Name: 'custom:nombre',
                    Value: user.firstName
                },
                {
                    Name: 'custom:apellido',
                    Value: user.lastName
                },
                {
                    Name: 'custom:psw',
                    Value: user.password
                },
                {
                    Name: 'custom:dpi',
                    Value: user.dpi
                }
            ]);
            if (cognitoResponse) {
                const userUpdated = await user.update(user);
                if (userUpdated) {
                    res.status(200).json({ message: 'User updated' });
                } else {
                    res.status(500).json({ message: 'An error has occurred while uploading the User DB' });
                }
            } else {
                res.status(500).json({ message: 'An error has occurred while uploading the User Cognito' });
            }
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
            if (userExist) {
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
            if (userExist) {
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
            if (requestExist) {
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
            if (requestExist) {
                const response = await request.accept();
                if (response) {
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
            if (requestExist) {
                const response = await request.delete();
                if (response) {
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
            if (userExist) {
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
            if (userExist) {
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

    async message(req, res) {
        try {
            const { message } = req.body;
            const socialBot = new chatBotModel('uniqueId', message);
            socialBot.singleMessage((error, chatResponse) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Failed ChatBot Response' });
                } else {
                    res.status(200).json({ response: chatResponse });
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async updateDpi(req, res) {
        try {
            const { id, dpi } = req.body;
            const user = new userModel(id, null, null, dpi, null, null, null);
            const userExist = await user.getById();
            if (userExist){
                const requests = await user.updateDPI();
                res.status(200).json({ message: 'DPI updated' });
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