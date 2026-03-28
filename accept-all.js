const db = require("./backend/config/db");

async function acceptAll() {
  try {
    const receiverId = 25; // User's ID
    const [users] = await db.query("SELECT user_id FROM users WHERE user_id != ?", [receiverId]);
    
    for (const u of users) {
      const senderId = u.user_id;
      // check if request exists
      const [existing] = await db.query("SELECT * FROM requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)", [senderId, receiverId, receiverId, senderId]);
      
      if (existing.length === 0) {
        // Create accepted request
        await db.query("INSERT INTO requests (sender_id, receiver_id, status) VALUES (?, ?, 'accepted')", [senderId, receiverId]);
      } else {
        // Update to accepted
        await db.query("UPDATE requests SET status = 'accepted' WHERE id = ?", [existing[0].id]);
      }
    }
    console.log("All other users are now accepted matches with user " + receiverId);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

acceptAll();
