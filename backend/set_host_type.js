const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function updateUserType() {
  try {
    const [result] = await pool.query(
      'UPDATE users SET user_type = ? WHERE user_id = ?',
      ['Host', 23]
    );
    console.log('User updated to Host:', result);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateUserType();
