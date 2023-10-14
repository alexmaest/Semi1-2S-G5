const db = require("../database");

class filterModel {
  constructor(id_filter, id_user, name) {
    this.id_filter = id_filter;
    this.id_user = id_user;
    this.name = name;
  }

  getAllFilters() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM FILTRO;";
      db.connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getFriendsPostsFilter() {
    return new Promise((resolve, reject) => {
      const query = `select p.*, u.nombre, u.apellido, u.correo from AMIGO a
      INNER JOIN PUBLICACION p ON p.id_usuario = a.id_amigo
      INNER JOIN USUARIO u ON u.id = a.id_amigo
      INNER JOIN PUBLICACION_FILTRO pf ON pf.id_publicacion = p.id
      WHERE pf.id_filtro = ? && a.id_usuario = ?;`;
      db.connection.query(query, [this.id_filter,this.id_user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getFiltersByNames() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM FILTRO WHERE nombre REGEXP ?;`;
      db.connection.query(query, [this.name], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = filterModel;
