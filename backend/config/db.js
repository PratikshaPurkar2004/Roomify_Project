// const mysql = require("mysql2");
// require("dotenv").config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// db.connect((err) => {
//   if (err) {
//     console.log("Database connection failed",err);
//   } else {
//     console.log("MySQL Connected ✅");
//   }
// });

// module.exports = db;


const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "roomify";

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick connection test to expose DB errors early
(async () => {
  try {
    await db.query("SELECT 1");
    console.log(`MySQL Connected ✅ (host=${DB_HOST}, user=${DB_USER}, database=${DB_NAME})`);
  } catch (err) {
    console.error(
      "MySQL connection failed. Check your DB credentials and that MySQL is running.",
      err.message || err
    );
  }
})();

module.exports = db;
