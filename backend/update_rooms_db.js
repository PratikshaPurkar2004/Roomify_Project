const db = require('./config/db');

async function updateRoomsTable() {
  try {
    const [columns] = await db.query("SHOW COLUMNS FROM rooms LIKE 'image_url'");
    if (columns.length === 0) {
      await db.query("ALTER TABLE rooms ADD COLUMN image_url VARCHAR(255) DEFAULT NULL");
      console.log("Successfully added image_url column to rooms table.");
    } else {
      console.log("image_url column already exists in rooms table.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error updating table: ", err);
    process.exit(1);
  }
}

updateRoomsTable();
