const db = require("./backend/config/db");

async function resetRequests() {
  try {
    const receiverId = 25; // User's ID
    
    // Set up to 3 accepted requests back to pending
    const [existing] = await db.query(
      "SELECT id FROM requests WHERE receiver_id = ? AND status = 'accepted' LIMIT 3", 
      [receiverId]
    );

    for (const req of existing) {
      await db.query("UPDATE requests SET status = 'pending' WHERE id = ?", [req.id]);
    }

    // Also let's make sure the user name shows correctly by logging the actual rows
    const [pending] = await db.query(
      "SELECT r.id, u.name FROM requests r JOIN users u ON r.sender_id = u.user_id WHERE r.receiver_id = ? AND r.status = 'pending'",
      [receiverId]
    );
    console.log("Pending requests now available from:");
    pending.forEach(p => console.log("- " + p.name));
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

resetRequests();
