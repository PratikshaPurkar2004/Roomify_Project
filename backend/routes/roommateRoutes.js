const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all roommates
router.get("/", async (req, res) => {

  const sql = `
    SELECT 
      u.user_id AS id,
      u.name,
      u.city AS location,
      u.gender,
      u.user_type,
      u.preferences,
      u.occupation,
      CASE 
        WHEN u.DOB > CURDATE() THEN 0 
        ELSE TIMESTAMPDIFF(YEAR, u.DOB, CURDATE()) 
      END AS age,
      (SELECT rent FROM rooms WHERE host_id = u.user_id LIMIT 1) AS rent,
      (SELECT AVG(rating) FROM review WHERE target_user_id = u.user_id) as avg_rating,
      (SELECT COUNT(*) FROM review WHERE target_user_id = u.user_id) as review_count
    FROM users u
    WHERE u.deletion_date IS NULL
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

// PUT (update) an existing roommate review
router.put("/reviews/:id", async (req, res) => {
  const reviewId = req.params.id;
  const { rating, comment, user_id } = req.body;

  try {
    // Ensure the review belongs to the user trying to edit it
    const [existing] = await db.query("SELECT user_id FROM review WHERE review_id = ?", [reviewId]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Review not found" });
    if (existing[0].user_id !== parseInt(user_id)) return res.status(403).json({ success: false, message: "Unauthorized to edit this review" });

    await db.query(`
      UPDATE review 
      SET rating = ?, comment = ?, review_date = CURRENT_DATE 
      WHERE review_id = ?
    `, [rating, comment, reviewId]);
    
    res.json({ success: true, message: "Review updated successfully!" });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// DELETE a review
router.delete("/reviews/:id", async (req, res) => {
  const reviewId = req.params.id;
  const { user_id } = req.body;

  try {
    const [existing] = await db.query("SELECT user_id FROM review WHERE review_id = ?", [reviewId]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Review not found" });
    if (existing[0].user_id !== parseInt(user_id)) return res.status(403).json({ success: false, message: "Unauthorized to delete this review" });

    await db.query("DELETE FROM review WHERE review_id = ?", [reviewId]);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
