const db = require("./config/db");

(async () => {
  try {
    const [columns] = await db.query("SHOW COLUMNS FROM rooms");
    console.log("Rooms Table Columns:");
    columns.forEach(col => console.log(`- ${col.Field}: ${col.Type}`));
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
})();
