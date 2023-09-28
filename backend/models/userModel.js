const db = require('../database');

class userModel {
  constructor(id_user, firstName, lastName, email, password, birthday, profilePhoto) {
    this.id_user = id_user;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.birthday = birthday;
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
}

module.exports = userModel;