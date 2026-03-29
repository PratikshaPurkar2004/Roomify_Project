const db = require("./config/db");

(async () => {
  try {
    console.log("Updating rooms table schema...");
    
    // Commands to add columns
    const columns = [
      { name: "address", type: "TEXT" },
      { name: "max_tenants", type: "INT DEFAULT 1" },
      { name: "furnishing", type: "VARCHAR(50) DEFAULT 'Unfurnished'" },
      { name: "amenities", type: "TEXT" }
    ];

    for (const col of columns) {
      try {
        await db.query(`ALTER TABLE rooms ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Added column: ${col.name}`);
      } catch (err) {
        // Handle 'Duplicate column name' error (1060)
        if (err.errno === 1060) {
          console.log(`Column already exists: ${col.name}`);
        } else {
          throw err;
        }
      }
    }

    console.log("Database schema updated successfully! ✅");
    process.exit(0);
  } catch (err) {
    console.error("Schema Update Error:", err);
    process.exit(1);
  }
})();
