const db = require('../database');
const bcrypt = require('bcrypt');
const cognitoService = require('../services/cognitoService');
class userModel {
  constructor(id_user, firstName, lastName, dpi, email, password, profilePhoto) {
    this.id_user = id_user;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dpi = dpi;
    this.email = email;
    this.password = password;
    this.profilePhoto = profilePhoto;
    this.passwordOriginal = password;
  }

  save() {
    return new Promise(async (resolve, reject) => {
      db.connection.beginTransaction(async (err) => {
        if (err) {
          reject(err);
          return;
        }
  
        const query = 'INSERT INTO USUARIO (id, nombre, apellido, dpi, correo, psw, foto) VALUES (?, ?, ?, ?, ?, ?, ?)';
        try {
          const result = await new Promise((resolve, reject) => {
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
                db.connection.rollback(() => {
                  reject(err);
                });
              } else {
                resolve(result);
              }
            });
          });
  
          // Parte de guardado en Cognito
          const cognito = new cognitoService();
          try {
            const success = await cognito.singUpUser(this.email, this.passwordOriginal, [
              {
                Name: 'picture',
                Value: this.profilePhoto
              },
              {
                Name: 'custom:psw',
                Value: this.password
              },
              {
                Name: 'custom:nombre',
                Value: this.firstName
              },
              {
                Name: 'custom:apellido',
                Value: this.lastName
              },
              {
                Name: 'custom:dpi',
                Value: this.dpi
              }
            ]);
            if (success) {
              db.connection.commit((err) => {
                if (err) {
                  db.connection.rollback(() => {
                    reject(err);
                  });
                } else {
                  console.log('Usuario registrado con éxito en Cognito');
                  resolve(result.affectedRows > 0);
                }
              });
            } else {
              console.log('Error al registrar usuario en Cognito');
              db.connection.rollback(() => {
                reject(new Error('Error al registrar usuario en Cognito'));
              });
            }
          } catch (error) {
            db.connection.rollback(() => {
              reject(error);
            });
          }
        } catch (error) {
          db.connection.rollback(() => {
            reject(error);
          });
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

  updateDPI() {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE USUARIO SET dpi = ? WHERE id = ?';
      db.connection.query(query, [this.dpi, this.id_user], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
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