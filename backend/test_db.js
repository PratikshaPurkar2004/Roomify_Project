const db = require("./config/db");

(async () => {
  try {
    const [rows] = await db.query("SHOW COLUMNS FROM users");
    console.log("USERS COLUMNS:", rows.map(r => r.Field));
    
    const [stats] = await db.query("SELECT * FROM users LIMIT 1");
    console.log("SAMPLED USER:", stats[0]);

    const [connectCols] = await db.query("SHOW COLUMNS FROM connect");
    console.log("CONNECT COLUMNS:", connectCols.map(r => r.Field));

    const [requestCols] = await db.query("SHOW COLUMNS FROM requests");
    console.log("REQUESTS COLUMNS:", requestCols.map(r => r.Field));

    process.exit(0);
  } catch (err) {
    console.error("DB TEST FAILED:", err);
    process.exit(1);
  }
})();
