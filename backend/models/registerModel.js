// models/registerModel.js
const db = require("../config/db");

const createUser = (name,email,occupation,password,user_type,gender,callback) => {
  const sql = `INSERT INTO users (name, email, occupation, password, user_type, gender) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql,[name, email, occupation, password, user_type, gender],callback);
};

module.exports = { createUser };
