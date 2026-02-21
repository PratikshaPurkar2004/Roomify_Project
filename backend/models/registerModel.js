// models/registerModel.js
const db = require("../config/db");

const createUser = (
  name,
  DOB,
  email,
  occupation,
  password,
  user_type,
  area,
  gender,
  callback
) => {
  const sql = `
    INSERT INTO users 
    (name, DOB, email, occupation, password, user_type, area, gender)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, DOB, email, occupation, password, user_type, area, gender],
    callback
  );
};

module.exports = { createUser };
