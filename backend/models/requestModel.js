const db = require('../database');

class requestModel {
  constructor(id_request, id_user, id_friend) {
    this.id_request = id_request;
    this.id_user = id_user;
    this.id_friend = id_friend;
  }

  save() {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO SOLICITUD (id_usuario, id_amigo) VALUES (?, ?);';
      db.connection.query(query, [this.id_user, this.id_friend], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }

  update() {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE SOLICITUD SET ? WHERE id = ?';
      db.connection.query(query, [this.id_user, this.id_request], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }

  delete() {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM SOLICITUD WHERE id = ?';
      db.connection.query(query, this.id_request, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }

  getById() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM SOLICITUD WHERE id = ?';
      db.connection.query(query, [this.id_request], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = requestModel;