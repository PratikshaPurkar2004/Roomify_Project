const db = require("./config/db");

async function fixSchema() {
  try {
    console.log("Checking review table schema...");
    
    const [columns] = await db.query("SHOW COLUMNS FROM review");
    const columnNames = columns.map(c => c.Field);

    // Ensure user_id exists
    if (!columnNames.includes("user_id")) {
      console.log("Adding user_id to review table...");
      await db.query("ALTER TABLE review ADD COLUMN user_id INT DEFAULT NULL");
      await db.query("ALTER TABLE review ADD CONSTRAINT fk_reviewer FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE");
    }

    // Ensure target_user_id exists
    if (!columnNames.includes("target_user_id")) {
      console.log("Adding target_user_id to review table...");
      await db.query("ALTER TABLE review ADD COLUMN target_user_id INT DEFAULT NULL");
      await db.query("ALTER TABLE review ADD CONSTRAINT fk_target_user FOREIGN KEY (target_user_id) REFERENCES users(user_id) ON DELETE CASCADE");
    }

    // Ensure room_id exists
    if (!columnNames.includes("room_id")) {
      console.log("Adding room_id to review table...");
      await db.query("ALTER TABLE review ADD COLUMN room_id INT DEFAULT NULL");
      await db.query("ALTER TABLE review ADD CONSTRAINT fk_review_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE");
    }

    // Make connect_id nullable if it exists
    if (columnNames.includes("connect_id")) {
      console.log("Making connect_id nullable...");
      await db.query("ALTER TABLE review MODIFY COLUMN connect_id INT NULL");
    }

    console.log("Review schema updated successfully! ✅");
    process.exit(0);
  } catch (err) {
    console.error("Schema Update Error:", err);
    process.exit(1);
  }
}

fixSchema();
