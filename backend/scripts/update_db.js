const db = require('../config/db');

async function updateDb() {
  try {
    const [occCols] = await db.query("SHOW COLUMNS FROM users LIKE 'occupation'");
    if (occCols.length === 0) {
      await db.query("ALTER TABLE users ADD COLUMN occupation VARCHAR(255) DEFAULT NULL");
      console.log("Column 'occupation' added successfully ✅");
    }

    const [imgCols] = await db.query("SHOW COLUMNS FROM users LIKE 'profile_image'");
    if (imgCols.length === 0) {
      await db.query("ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL");
      console.log("Column 'profile_image' added successfully ✅");
    } else {
      console.log("Column 'profile_image' already exists ✅");
    }
    process.exit(0);
  } catch (err) {
    console.error("Database update failed ❌", err);
    process.exit(1);
  }
}

updateDb();
