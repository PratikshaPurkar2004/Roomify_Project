const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearReviews() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'roomify'
  });

  try {
    console.log("Cleaning up sample data to show dynamic nature...");
    await db.query("TRUNCATE TABLE review");
    console.log("Review table cleared! ✅");
  } catch (error) {
    console.error("Error clearing reviews:", error);
  } finally {
    await db.end();
  }
}

clearReviews();
