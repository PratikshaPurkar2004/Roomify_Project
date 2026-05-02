const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all roommates
router.get("/", async (req, res) => {

  const sql = `
    SELECT 
      users.user_id AS id,
      users.name,
      users.city AS location,
      users.gender,
      users.user_type,
      users.preferences,
      users.occupation,
      TIMESTAMPDIFF(YEAR, users.DOB, CURDATE()) AS age,
      IFNULL(rooms.rent, users.budget) AS rent,
      (SELECT AVG(rating) FROM review WHERE target_user_id = users.user_id) as avg_rating,
      (SELECT COUNT(*) FROM review WHERE target_user_id = users.user_id) as review_count
    FROM users
    LEFT JOIN rooms 
    ON users.user_id = rooms.host_id
    WHERE users.deletion_date IS NULL
  `;

  try {
    console.log("Fetching roommates from database...");
    const [results] = await db.query(sql);
    console.log(`Retrieved ${results.length} roommates`);
    return res.json(results);
  } catch (err) {
    console.error("Database error (roommates):", err.message);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET reviews for a specific roommate
router.get("/:id/reviews", async (req, res) => {
  const targetId = req.params.id;
  try {
    const [reviews] = await db.query(`
      SELECT r.*, u.name as reviewer_name 
      FROM review r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.target_user_id = ? 
      ORDER BY r.review_date DESC
    `, [targetId]);
    
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// POST a new review for a roommate
router.post("/:id/reviews", async (req, res) => {
  const targetId = req.params.id;
  const { user_id, rating, comment } = req.body;
  
  try {
    await db.query(`
      INSERT INTO review (target_user_id, user_id, rating, comment, review_date) 
      VALUES (?, ?, ?, ?, CURRENT_DATE)
    `, [targetId, user_id, rating, comment]);
    
    res.json({ success: true, message: "Roommate review submitted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
