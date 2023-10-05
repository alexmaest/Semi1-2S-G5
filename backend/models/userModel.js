const db = require('../database');
const bcrypt = require('bcrypt');

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
      const query = 'INSERT INTO USUARIO (id, nombre, apellido, dpi, correo, psw, foto) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.connection.query(query, [
        this.id_user,
        this.firstName,
        this.lastName,
        this.dpi,
        this.email,
        this.password,
        this.profilePhoto
      ], (err, result) => {
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
      const query = 'SELECT * FROM USUARIO WHERE Id = ?';
      db.connection.query(query, [this.id_user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getByEmail() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM USUARIO WHERE correo = ?';
      db.connection.query(query, [this.email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  generateHash() {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(this.password, saltRounds);
    return hash;
  }

  compareHash(hashedPassword) {
    return bcrypt.compareSync(this.password, hashedPassword);
  }
}

module.exports = userModel;