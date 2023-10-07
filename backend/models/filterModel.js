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
      const query = `select p.*, u.nombre, u.apellido, u.correo from PUBLICACION p
      LEFT JOIN AMIGO a ON a.id_amigo = p.id_usuario
      INNER JOIN USUARIO u ON u.id = p.id_usuario
      INNER JOIN PUBLICACION_FILTRO pf ON pf.id_publicacion = p.id
      INNER JOIN FILTRO f ON f.id = pf.id_filtro
      WHERE (u.id = ? || a.id_usuario = ?) && f.id = ? ORDER BY p.fecha DESC;`;
      db.connection.query(query, [this.id_user, this.id_user, this.id_filter], (err, result) => {
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
