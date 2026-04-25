const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST a new request
router.post("/", async (req, res) => {
  const { sender_id, receiver_id } = req.body;
  if (!sender_id || !receiver_id) {
    return res.status(400).json({ success: false, message: "Missing sender or receiver ID" });
  }

  if (sender_id === receiver_id) {
    return res.status(400).json({ success: false, message: "You cannot request yourself." });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM requests WHERE sender_id = ? AND receiver_id = ?",
      [sender_id, receiver_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Request already sent to this user." });
    }

    const sql = `INSERT INTO requests (sender_id, receiver_id, status) VALUES (?, ?, 'pending')`;
    await db.query(sql, [sender_id, receiver_id]);
    
    res.json({ success: true, message: "Request sent successfully! ✅" });
  } catch (err) {
    console.error("Database error (requests POST):", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET all requests for a user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT 
      r.id as request_id,
      r.sender_id,
      u.name,
      u.city,
      u.gender,
      u.budget as base_budget,
      IFNULL(rooms.rent, u.budget) AS rent,
      r.status,
      r.created_at
    FROM requests r
    JOIN users u ON r.sender_id = u.user_id
    LEFT JOIN rooms ON u.user_id = rooms.host_id
    WHERE r.receiver_id = ?
    ORDER BY r.created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [userId]);
    const formatted = results.map(row => ({
      id: row.request_id,
      senderId: row.sender_id,
      name: row.name,
      city: row.city,
      gender: row.gender,
      budget: row.rent, 
      status: row.status
    }));

    res.json({ success: true, requests: formatted });
  } catch (err) {
    console.error("Database error (requests GET):", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET all requests SENT by a user
router.get("/sent/:userId", async (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT receiver_id FROM requests WHERE sender_id = ?";
  
  try {
    const [results] = await db.query(sql, [userId]);
    res.json({ success: true, sentRequests: results.map(r => r.receiver_id) });
  } catch (err) {
    console.error("Database error (requests sent GET):", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET all requests SENT by a user with full details
router.get("/sent-details/:userId", async (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT 
      r.id as request_id,
      r.receiver_id as peer_id,
      u.name,
      u.city,
      u.gender,
      IFNULL(rooms.rent, u.budget) AS budget,
      r.status,
      r.created_at
    FROM requests r
    JOIN users u ON r.receiver_id = u.user_id
    LEFT JOIN rooms ON u.user_id = rooms.host_id
    WHERE r.sender_id = ?
    ORDER BY r.created_at DESC
  `;
  try {
    const [results] = await db.query(sql, [userId]);
    res.json({ success: true, requests: results });
  } catch (err) {
    console.error("Database error (requests sent-details GET):", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET all user IDs with whom the current user has an ACCEPTED connection
router.get("/accepted-ids/:userId", async (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT 
      CASE 
        WHEN sender_id = ? THEN receiver_id 
        WHEN receiver_id = ? THEN sender_id 
      END AS peer_id
    FROM requests 
    WHERE status = 'accepted' AND (sender_id = ? OR receiver_id = ?)
  `;
  
  try {
    const [results] = await db.query(sql, [userId, userId, userId, userId]);
    res.json({ success: true, acceptedIds: results.map(r => r.peer_id) });
  } catch (err) {
    console.error("Database error (requests accepted GET):", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Update status of request (PUT)
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 
  
  try {
    await db.query("UPDATE requests SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true, message: `Request ${status}!` });
  } catch (err) {
    console.error("Database error (requests PUT status):", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// DELETE (unsend) a request
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM requests WHERE id = ?", [id]);
    res.json({ success: true, message: "Request cancelled successfully! ✅" });
  } catch (err) {
    console.error("Database error (requests DELETE):", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
