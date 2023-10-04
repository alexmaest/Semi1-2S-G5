const db = require("../database");
const {
  TranslateClient,
  TranslateTextCommand,
} = require("@aws-sdk/client-translate");

const config = {
  region: process.env.AWS_REGION_ACCESS_KEY,
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_TRANSLATE_KEY,
    secretAccessKey: process.env.AWS_SECRET_TRANSLATE_KEY,
  },
};

const translate = new TranslateClient(config);

class publicationModel {
  constructor(description, image, date, id_user) {
    this.description = description;
    this.image = image;
    this.date = date;
    this.id_user = id_user;
  }

  save() {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO PUBLICACION (descripcion, imagen, fecha, id_usuario) VALUES (?, ?, ?, ?);";
      db.connection.query(
        query,
        [this.description, this.image, this.date, this.id_user],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows > 0);
          }
        }
      );
    });
  }
  
  getAllPost() {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT U.nombre, U.apellido, P.* FROM PUBLICACION P INNER JOIN USUARIO U ON U.id = P.id_usuario;";
      db.connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getUserPosts() {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT U.nombre, U.apellido, P.* FROM PUBLICACION P INNER JOIN USUARIO U ON U.id = P.id_usuario WHERE U.id = ?;";
      db.connection.query(query, [this.id_user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = publicationModel;
