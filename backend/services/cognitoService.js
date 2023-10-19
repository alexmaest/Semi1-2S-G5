require('dotenv').config();
const AWS = require('aws-sdk');
const crypto = require('crypto');

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_COGNITO,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_COGNITO,
    apiVersion: process.env.AWS_API_VERSION_COGNITO,
    region: process.env.AWS_REGION_COGNITO,
}
const secretHash = process.env.AWS_SECRET_HASH_COGNITO;
const clientId = process.env.AWS_CLIENT_ID_COGNITO;

class CognitoService {
    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(config)
    }

    async singUpUser(userName, userPassword, userAttr) {

        const params = {
            ClientId: clientId,
            Password: userPassword,
            Username: userName,
            SecretHash: hashSecret(userName),
            UserAttributes: userAttr
        }

        try {
            const response = await this.cognitoIdentity.signUp(params).promise();
            console.log('Usuario registrado con éxito:', response);
            return true
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return false
        }
    }

    async signInUser(username, password) {
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH', /* required */
            ClientId: clientId, /* required */
            AuthParameters: {
                'USERNAME': username,
                'PASSWORD': password,
                'SECRET_HASH': hashSecret(username)
            },
        }

        try {
            let data = await this.cognitoIdentity.initiateAuth(params).promise();
            console.log(data);
            return { success: true, data: data };
        } catch (error) {
            console.log(error)
            return { success: false, data: error };
        }
    }

    async confirmSignUp(username, code) {
        const params = {
            ClientId: clientId,
            ConfirmationCode: code,
            Username: username,
            SecretHash: hashSecret(username),
        };

        try {
            const cognitoResp = await this.cognitoIdentity.confirmSignUp(params).promise();
            console.log(cognitoResp)
            return true
        } catch (error) {
            console.log("error", error)
            return false
        }
    }

    async forgotPassword(username) {
        const params = {
            ClientId: clientId, /* required */
            Username: username, /* required */
            SecretHash: hashSecret(username),
        }

        try {
            const data = await this.cognitoIdentity.forgotPassword(params).promise();
            console.log(data);
            return true
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async confirmNewPassword(username, password, code) {
        const params = {
            ClientId: clientId, /* required */
            ConfirmationCode: code, /* required */
            Password: password, /* required */
            Username: username, /* required */
            SecretHash: hashSecret(username),
        };

        try {
            const data = await this.cognitoIdentity.confirmForgotPassword(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getAttributes(username) {
        const params = {
            UserPoolId: process.env.AWS_USER_POOL_ID_COGNITO,
            Username: username,
        };
        return new Promise((resolve, reject) => {
            this.cognitoIdentity.adminGetUser(params, (err, data) => {
                if (err) {
                    console.error('Error al recuperar los atributos del usuario:', err);
                    reject(err);
                } else {
                    // data.UserAttributes contiene los atributos del usuario
                    const userAttributes = data.UserAttributes;
                    // Encuentra el atributo que deseas (por ejemplo, 'picture')
                    const pictureAttribute = userAttributes.find((attr) => attr.Name === 'picture');
    
                    if (pictureAttribute) {
                        const pictureUrl = pictureAttribute.Value;
                        console.log('URL de la imagen:', pictureUrl);
                        resolve(pictureUrl);
                    } else {
                        console.log('Atributo de imagen no encontrado');
                        resolve(null);
                    }
                }
            });
        });
    }

    async getAllAttributes(username) {
        const params = {
            UserPoolId: process.env.AWS_USER_POOL_ID_COGNITO,
            Username: username,
        };
        return new Promise((resolve, reject) => {
            this.cognitoIdentity.adminGetUser(params, (err, data) => {
                if (err) {
                    console.error('Error al recuperar los atributos del usuario:', err);
                    reject(err);
                } else {
                    // data.UserAttributes contiene los atributos del usuario
                    const userAttributes = data.UserAttributes;
                    // Encuentra el atributo que deseas (por ejemplo, 'picture')
                    resolve(userAttributes);
                }
            });
        });
    }
}

function hashSecret(username) {
    return crypto.createHmac('SHA256', secretHash)
        .update(username + clientId)
        .digest('base64');
}

module.exports = CognitoService;