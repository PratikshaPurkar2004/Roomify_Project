// models/loginModel.js
const db = require("../config/db");

const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

module.exports = { findUserByEmail };
