require('dotenv').config();
const AWS = require('aws-sdk');
const crypto = require('crypto');
const fs = require('fs');

const rekognition = new AWS.Rekognition({ 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_COGNITO,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_COGNITO,
    region: process.env.AWS_REGION_REKOGNITION 
});

class RekognitionService {
    constructor() {
    }

    async getComparasionFaces(photoBase64, photoCompare, umbral) {
        try {
            const parts = photoCompare.split(",");
            let photoBase64Compare = null;
            if (parts.length === 2) {
                photoBase64Compare = parts[1];
            } else {
                console.log("La cadena no contiene datos en formato base64 válido.");
                return false; // Retorna directamente en caso de error.
            }
    
            const params = {
                SimilarityThreshold: umbral,
                SourceImage: {
                    Bytes: Buffer.from(photoBase64, 'base64'),
                },
                TargetImage: {
                    Bytes: Buffer.from(photoBase64Compare, 'base64'),
                },
            };
    
            const data = await rekognition.compareFaces(params).promise();
    
            if (data.FaceMatches.length > 0) {
                const similarity = data.FaceMatches[0].Similarity;
                console.log('Porcentaje de similitud:', similarity);
                return true;
            } else {
                console.log('No se encontraron coincidencias de caras.');
                return false;
            }
        } catch (error) {
            console.error('Error al comparar las caras:', error);
            return false;
        }
    };
}


module.exports = RekognitionService;