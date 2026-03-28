const db = require("./backend/config/db");

async function cleanup() {
  try {
    const userId = 25;
    await db.query("DELETE FROM requests WHERE sender_id = ? OR receiver_id = ?", [userId, userId]);
    console.log("All requests involving test user have been deleted.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
cleanup();
