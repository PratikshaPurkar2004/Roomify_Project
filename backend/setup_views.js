const db = require("./config/db");

async function setupViews() {
  try {
    // Add views column to users if missing
    try {
      await db.query("ALTER TABLE users ADD COLUMN views INT DEFAULT 0");
      console.log("Added views column to users table.");
    } catch (e) {
      console.log("Views column already exists or error adding it.");
    }

    // Create views_log table
    await db.query(`
      CREATE TABLE IF NOT EXISTS views_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        viewer_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);
    console.log("Created views_log table.");
    process.exit(0);
  } catch (err) {
    console.error("Setup Views Error:", err);
    process.exit(1);
  }
}

setupViews();
