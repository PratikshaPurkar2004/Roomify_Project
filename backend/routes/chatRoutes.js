const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET messages between two users
router.get("/:userId/:contactId", async (req, res) => {
  const { userId, contactId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY created_at ASC`,
      [userId, contactId, contactId, userId]
    );
    res.json({ success: true, messages: rows });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, message: "Error fetching messages" });
  }
});

// POST new message
router.post("/", async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  
  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`,
      [sender_id, receiver_id, content]
    );

    const [newMessage] = await db.query(`SELECT * FROM messages WHERE id = ?`, [result.insertId]);
    res.json({ success: true, message: newMessage[0] });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ success: false, message: "Error saving message" });
  }
});


// GET total message count for a user (free trial limit)
router.get("/eligibility/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) as msgCount FROM messages WHERE sender_id = ?",
      [userId]
    );
    res.json({ success: true, msgCount: rows[0].msgCount });
  } catch (err) {
    console.error("Error checking eligibility:", err);
    res.status(500).json({ success: false, msgCount: 0 });
  }
});

// PUT mark messages as read
router.put("/read/:userId/:contactId", async (req, res) => {
  const { userId, contactId } = req.params;
  try {
    await db.query(
      "UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ? AND is_read = 0",
      [userId, contactId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ success: false, message: "Error updating messages" });
  }
});

// DELETE clear chat history
router.delete("/clear/:userId/:contactId", async (req, res) => {
  const { userId, contactId } = req.params;
  try {
    await db.query(
      "DELETE FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
      [userId, contactId, contactId, userId]
    );
    res.json({ success: true, message: "Chat history cleared" });
  } catch (err) {
    console.error("Clear chat error:", err);
    res.status(500).json({ success: false, message: "Error clearing chat" });
  }
});

// GET contacts list for a user
router.get("/contacts/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT 
        u.user_id as id, 
        u.name, 
        u.city,
        m.content as last_message, 
        m.created_at as last_msg_time,
        (SELECT COUNT(*) FROM messages m2 WHERE m2.receiver_id = ? AND m2.sender_id = u.user_id AND m2.is_read = 0) as unread_count
      FROM users u
      JOIN (
        SELECT 
          CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as contact_id,
          MAX(id) as max_id
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        GROUP BY contact_id
      ) last_msgs ON u.user_id = last_msgs.contact_id
      JOIN messages m ON m.id = last_msgs.max_id
      ORDER BY m.created_at DESC`,
      [userId, userId, userId, userId]
    );

    const formattedContacts = rows.map(c => ({
      ...c,
      roomid: [parseInt(userId), parseInt(c.id)].sort((a, b) => a - b).join('_')
    }));

    res.json({ success: true, contacts: formattedContacts });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ success: false, message: "Error fetching contacts" });
  }
});

module.exports = router;

