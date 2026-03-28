const db = require("./backend/config/db");

async function fixDb() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(user_id),
        FOREIGN KEY (receiver_id) REFERENCES users(user_id)
      )
    `);
    console.log("Messages table created!");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
fixDb();
