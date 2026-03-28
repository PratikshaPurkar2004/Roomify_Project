const db = require('./backend/config/db');

async function migrate() {
  try {
    await db.query("ALTER TABLE users ADD COLUMN views INT DEFAULT 0");
    console.log("Views column successfully added to users table.");
    process.exit(0);
  } catch (err) {
    if (err.code === 'ER_DUP_COLUMN_NAME') {
      console.log("Views column already exists.");
      process.exit(0);
    }
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrate();
