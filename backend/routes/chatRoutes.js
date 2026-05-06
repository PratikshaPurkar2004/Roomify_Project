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

module.exports = router;
