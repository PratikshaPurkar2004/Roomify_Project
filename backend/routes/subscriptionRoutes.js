const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST - Subscribe a user
router.post("/subscribe", async (req, res) => {
  const { user_id, plan_name, amount } = req.body;

  if (!user_id || !plan_name || !amount) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Check if user already has an active subscription
    const [existing] = await db.query(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'",
      [user_id]
    );

    if (existing.length > 0) {
      return res.json({ success: true, message: "Already subscribed!", already: true });
    }

    // Calculate end date based on plan
    const startDate = new Date();
    const endDate = new Date();
    if (plan_name === "Yearly Plan") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    await db.query(
      `INSERT INTO subscriptions (user_id, plan_name, amount, status, start_date, end_date) 
       VALUES (?, ?, ?, 'active', ?, ?)`,
      [user_id, plan_name, amount, startDate, endDate]
    );

    res.json({ success: true, message: "Subscription activated! 🎉" });
  } catch (err) {
    console.error("Subscription error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET - Check subscription status
router.get("/status/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' AND end_date > NOW()",
      [userId]
    );

    res.json({ subscribed: rows.length > 0 });
  } catch (err) {
    console.error("Check subscription error:", err);
    res.status(500).json({ subscribed: false });
  }
});

// GET - Get accepted contacts for chat
router.get("/contacts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const sql = `
      SELECT 
        u.user_id as id,
        u.name,
        u.area,
        u.gender,
        u.email
      FROM requests r
      JOIN users u ON (
        (r.sender_id = ? AND u.user_id = r.receiver_id) OR
        (r.receiver_id = ? AND u.user_id = r.sender_id)
      )
      WHERE r.status = 'accepted'
      AND (r.sender_id = ? OR r.receiver_id = ?)
    `;

    const [rows] = await db.query(sql, [userId, userId, userId, userId]);
    res.json({ success: true, contacts: rows });
  } catch (err) {
    console.error("Get contacts error:", err);
    res.status(500).json({ success: false, contacts: [] });
  }
});

module.exports = router;
