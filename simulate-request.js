const db = require("./backend/config/db");

async function simulateRequest() {
  try {
    // Current user is 25 (Pratiksha). We need a sender. Let's find any other user.
    const [users] = await db.query("SELECT user_id, name FROM users WHERE user_id != 25 LIMIT 1");
    if (users.length === 0) {
      console.log("No other users found to send the request from.");
      process.exit();
    }
    const sender = users[0];
    const receiverId = 25;

    // Check if request exists
    const [existing] = await db.query("SELECT * FROM requests WHERE sender_id = ? AND receiver_id = ?", [sender.user_id, receiverId]);
    if (existing.length > 0) {
      await db.query("UPDATE requests SET status = 'pending' WHERE id = ?", [existing[0].id]);
      console.log(`Updated existing request from ${sender.name} to pending status!`);
    } else {
      await db.query("INSERT INTO requests (sender_id, receiver_id, status) VALUES (?, ?, 'pending')", [sender.user_id, receiverId]);
      console.log(`Created new pending request from ${sender.name}!`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

simulateRequest();
