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

class commentModel {
  constructor(content, id_user, id_post) {
    this.content = content;
    this.id_user = id_user;
    this.id_post = id_post;
  }

  save() {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO COMENTARIO (contenido, id_usuario, id_publicacion) VALUES (?, ?, ?);";
      db.connection.query(
        query,
        [this.content, this.id_user, this.id_post],
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

  translate(language) {
    return new Promise((resolve, reject) => {
      const params = {
        Text: this.description,
        SourceLanguageCode: "auto",
        TargetLanguageCode: language,
      };

      translate
        .send(new TranslateTextCommand(params))
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getCommentPost() {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT U.nombre, U.apellido, U.correo, C.* FROM COMENTARIO C INNER JOIN USUARIO U ON U.id = C.id_usuario WHERE C.id_publicacion = ?;";
      db.connection.query(query, [this.id_post], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = commentModel;
