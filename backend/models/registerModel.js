// models/registerModel.js
const db = require("../config/db");

const createUser = (name,email,occupation,password,gender,callback) => {
  const sql = `INSERT INTO users (name, email, occupation, password, gender) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql,[name, email, occupation, password,gender],callback);
};

module.exports = { createUser };
