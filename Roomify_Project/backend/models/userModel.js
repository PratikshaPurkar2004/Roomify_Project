const db = require("../config/db");

const createUser = (name, DOB, email, occupation, password, callback) => {
  const sql = `
    INSERT INTO user (name, DOB, email, occupation, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, DOB, email, occupation, password], callback);
};

const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM user WHERE email = ?";
  db.query(sql, [email], callback);
};

module.exports = { createUser, findUserByEmail };
