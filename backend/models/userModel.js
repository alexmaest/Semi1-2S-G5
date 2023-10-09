const db = require('../database');

class userModel {
  constructor(id_user, firstName, lastName, dpi, email, password, profilePhoto) {
    this.id_user = id_user;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dpi = dpi;
    this.email = email;
    this.password = password;
    this.profilePhoto = profilePhoto;
  }

  save() {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO user (name, password) VALUES (?, ?);';
      db.connection.query(query, [this.firstName, this.password], (err, result) => {
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
      const query = 'UPDATE user SET ? WHERE id_user = ?';
      db.connection.query(query, [this.firstName, this.id_user], (err, result) => {
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
      const query = 'DELETE FROM user WHERE id_user = ?';
      db.connection.query(query, this.id_user, (err, result) => {
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
      const query = 'SELECT * FROM USUARIO WHERE id = ?';
      db.connection.query(query, [this.id_user], (err, result) => {
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

  getNotFriends() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.id, u.nombre AS firstname, u.apellido AS lastname, u.correo AS email, u.foto AS profilePhoto
        FROM USUARIO u
        WHERE (u.id NOT IN (SELECT id_amigo FROM AMIGO WHERE id_usuario = ?) AND u.id != ?)
        AND (u.id NOT IN (SELECT id_usuario FROM AMIGO WHERE id_amigo = ?) AND u.id != ?)
      `;
      db.connection.query(query, [this.id_user, this.id_user, this.id_user, this.id_user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getFriends() {
    return new Promise((resolve, reject) => {
      const query = `
        (SELECT id, nombre AS firstname, apellido AS lastname, correo AS email, foto AS profilePhoto
         FROM USUARIO
         WHERE id IN (SELECT id_amigo FROM AMIGO WHERE id_usuario = ?))
        UNION
        (SELECT id, nombre AS firstname, apellido AS lastname, correo AS email, foto AS profilePhoto
         FROM USUARIO
         WHERE id IN (SELECT id_usuario FROM AMIGO WHERE id_amigo = ?))
      `;
      db.connection.query(query, [this.id_user, this.id_user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = userModel;