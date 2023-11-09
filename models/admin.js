const config = require("../config/config");
const mysql = require("mysql");

const connAttrs = mysql.createConnection(config.connection);

// login an admin
const addNewAdmin = (data) => {
  return new Promise((resolve, reject) => {
    connAttrs.query("SELECT email from admins", [], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (result.length !== 0) {
        reject(result);
      }
      connAttrs.query(
        "INSERT INTO admins (name, email, username, password) VALUES (?,?,?,?)",
        [data.name, data.email, data.username, data.password],
        (err, result, fields) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(result);
        }
      );
    });
  });
};

const loginAdmin = (data) => {
  return new Promise((resolve, reject) => {
    connAttrs.query(
      "SELECT * FROM admins WHERE email = ?",
      [data.email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

const getAdminById = (data) => {
  return new Promise((resolve, reject) => {
    connAttrs.query(
      "SELECT * FROM admins WHERE id = ?",
      [data.id],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

const changeAdminPassword = (data) => {
  return new Promise((resolve, reject) => {
    connAttrs.query(
      "UPDATE admins SET password = ? WHERE id = ?",
      [data.password, data.id],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

const getAdmins = () => {
  return new Promise((resolve, reject) => {
    connAttrs.query(
      "SELECT id, name, email, username, created_at FROM admins",
      [],
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

module.exports = {
  addNewAdmin,
  loginAdmin,
  getAdminById,
  changeAdminPassword,
  getAdmins,
};