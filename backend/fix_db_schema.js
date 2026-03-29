const db = require("./config/db");

(async () => {
  try {
    console.log("Applying necessary DB schema fixes...");

    // 1. Rename 'area' to 'city' in 'users' table if it exists as 'area'
    // Actually, it's safer to check first.
    const [cols] = await db.query("SHOW COLUMNS FROM users");
    const fieldNames = cols.map(c => c.Field);

    if (fieldNames.includes("area") && !fieldNames.includes("city")) {
      console.log("Renaming 'area' to 'city' in 'users' table...");
      await db.query("ALTER TABLE users CHANGE COLUMN area city VARCHAR(100)");
    } else if (!fieldNames.includes("city")) {
      console.log("Adding 'city' column to 'users' table...");
      await db.query("ALTER TABLE users ADD COLUMN city VARCHAR(100)");
    }

    // 2. Add 'user_type' if missing
    if (!fieldNames.includes("user_type")) {
      console.log("Adding 'user_type' column to 'users' table...");
      await db.query("ALTER TABLE users ADD COLUMN user_type ENUM('Host', 'Finder') DEFAULT 'Finder'");
    }

    // 3. Add 'views' if missing
    if (!fieldNames.includes("views")) {
      console.log("Adding 'views' column to 'users' table...");
      await db.query("ALTER TABLE users ADD COLUMN views INT DEFAULT 0");
    }

    console.log("Schema fix complete ✅");
    process.exit(0);
  } catch (err) {
    console.error("Schema Fix Error:", err.message);
    process.exit(1);
  }
})();
