const db = require("../database");
const {
  RekognitionClient,
  DetectLabelsCommand,
} = require("@aws-sdk/client-rekognition");

const config = {
  region: process.env.AWS_REGION_ACCESS_KEY,
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

const rekognition = new RekognitionClient(config);

class publicationModel {
  constructor(description, image, date, id_user) {
    this.description = description;
    this.image = image;
    this.date = date;
    this.id_user = id_user;
  }

  save() {
    return new Promise(async (resolve, reject) => {
      const query = "select InsertarPublicacion(?, ?, ?, ?) as Id;";
      db.connection.query(
        query,
        [this.description, this.image, this.date, this.id_user],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            this.postFilters(result[0].Id);
            resolve(true);
          }
        }
      );
    });
  }

  getFriendPosts() {
    return new Promise((resolve, reject) => {
      const query = `select p.*, u.nombre, u.apellido, u.correo from PUBLICACION p
      LEFT JOIN AMIGO a ON a.id_amigo = p.id_usuario
      INNER JOIN USUARIO u ON u.id = p.id_usuario
      WHERE u.id = ? || a.id_usuario = ? ORDER BY p.fecha DESC;`;
      db.connection.query(query, [this.id_user, this.id_user], (err, result) => {
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

  async postFilters(id_post) {
    const params = {
      Image: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Name: this.image.replace(
            `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION_ACCESS_KEY}.amazonaws.com/`,
            ""
          ),
        },
      },
      MaxLabels: 5,
    };

    try {
      const data = await rekognition.send(new DetectLabelsCommand(params));
      data.Labels
        ? data.Labels.forEach((element) => {
            const query = "call InsertarFiltro(?,?);";
            db.connection.query(
              query,
              [element.Name, id_post],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          })
        : null;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = publicationModel;
