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
      IFNULL(rooms.rent, users.budget) AS rent
    FROM users
    LEFT JOIN rooms 
    ON users.user_id = rooms.host_id
  `;

  try {
    console.log("Fetching roommates from database...");
    const [results] = await db.query(sql);
    console.log(`Retrieved ${results.length} roommates`);
    return res.json(results);
  } catch (err) {
    console.error("Database error (roommates):", err.message);
    console.error("Full error:", err);
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message
    });
  }

});

module.exports = router;
