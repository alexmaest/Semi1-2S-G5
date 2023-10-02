const db = require("../database");
const {
  TranslateClient,
  TranslateTextCommand
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
        "INSERT INTO publicacion (descripcion, imagen, fecha, id_usuario) VALUES (?, ?, ?, ?);";
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
}

module.exports = publicationModel;
