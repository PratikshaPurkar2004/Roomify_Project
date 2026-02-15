const db = require("../config/db");

const createUser = (
  name,
  DOB,
  email,
  occupation,
  password,
  user_type,
  city,
  callback
) => {
  const sql = `
    INSERT INTO users 
    (name, DOB, email, occupation, password, user_type, city)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, DOB, email, occupation, password, user_type, city],
    callback
  );
};

const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

module.exports = { createUser, findUserByEmail };
