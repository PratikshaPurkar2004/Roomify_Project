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

module.exports = router;
