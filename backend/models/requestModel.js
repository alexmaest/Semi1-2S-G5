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

  accept() {
    return new Promise((resolve, reject) => {
      db.connection.beginTransaction((err) => {
        if (err) {
          return reject(err);
        }

        const insertQuery = 'INSERT INTO AMIGO (id_usuario, id_amigo) VALUES (?, ?)';
        db.connection.query(insertQuery, [this.id_user, this.id_friend], (err, insertResult) => {
          if (err) {
            return db.connection.rollback(() => {
              reject(err);
            });
          }

          const deleteQuery = 'DELETE FROM SOLICITUD WHERE id = ?';
          db.connection.query(deleteQuery, [this.id_request], (err, deleteResult) => {
            if (err) {
              return db.connection.rollback(() => {
                reject(err);
              });
            }

            db.connection.commit((err) => {
              if (err) {
                return db.connection.rollback(() => {
                  reject(err);
                });
              }

              resolve(true);
            });
          });
        });
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
          if (result.length > 0) {
            const { id_usuario, id_amigo } = result[0];
            this.id_user = id_usuario;
            this.id_friend = id_amigo;
            resolve(result[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  getByUsersIds() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM SOLICITUD WHERE (id_usuario = ? AND id_amigo = ?) OR (id_usuario = ? AND id_amigo = ?)';
      db.connection.query(query, [this.id_user, this.id_friend, this.id_friend, this.id_user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  getRequestSent() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT S.id, U.id AS friendId, U.nombre AS firstname, U.apellido AS lastname, U.correo AS email, U.foto AS profilePhoto
        FROM SOLICITUD S
        INNER JOIN USUARIO U ON S.id_amigo = U.id
        WHERE S.id_usuario = ?
      `;
      
      db.connection.query(query, [this.id_user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getRequestReceived() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT S.id, U.id AS friendId, U.nombre AS firstname, U.apellido AS lastname, U.correo AS email, U.foto AS profilePhoto
        FROM SOLICITUD S
        INNER JOIN USUARIO U ON S.id_usuario = U.id
        WHERE S.id_amigo = ?
      `;
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

module.exports = requestModel;