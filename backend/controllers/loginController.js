const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const https = require('https');
const fs = require('fs');
const cognitoService = require('../services/cognitoService');
const rekognitionService = require('../services/rekognitionService');
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

    async usersLoginImage(req, res) {
        try {
            const { email, imageLoggingBase64 } = req.body;
            const user = new userModel(null, null, null, null, email, null, null);
            const userByEmail = await user.getByEmail();
            if (!userByEmail) {
                res.status(501).json({ message: 'Account with that email not exist' });
            } else {
                const cognito = new cognitoService();
                const urlImage = await cognito.getAttributes(email);
                const userAttributes = await cognito.getAllAttributes(email);
                console.log(urlImage);
                const imageProfileBase64 = await new Promise((resolve, reject) => {
                    https.get(urlImage, (response) => {
                        const data = [];
                
                        response.on('data', (chunk) => {
                            data.push(chunk);
                        });
                
                        response.on('end', () => {
                            const buffer = Buffer.concat(data);
                            const base64Image = buffer.toString('base64');
                            resolve(base64Image);
                        });
                
                        response.on('error', (error) => {
                            reject(error);
                        });
                    });
                });

                //console.log(imageProfileBase64);
                const rekognition = new rekognitionService();
                const result = await rekognition.getComparasionFaces(imageProfileBase64, imageLoggingBase64);
                console.log(result)
                if (result) {
                    const password = userAttributes.find((attr) => attr.Name === 'custom:psw');
                    const token = jwt.sign({ email, password }, process.env.AUTH_KEY, { expiresIn: '1h' });
                    res.status(200).json({ id_User: userByEmail.id_User, token: token, message: 'Successful request' });
                    // res.status(200).json({ message: 'Successful request' });
                } else {
                    res.status(501).json({ message: result });
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