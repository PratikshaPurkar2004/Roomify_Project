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
      IFNULL(rooms.rent, users.budget) AS rent
    FROM users
    LEFT JOIN rooms 
    ON users.user_id = rooms.host_id
  `;

  try {
    const [results] = await db.query(sql);
    return res.json(results);
  } catch (err) {
    console.error("Database error (roommates):", err);
    return res.status(500).json({
      success: false,
      message: "Database error"
    });
  }

});

module.exports = router;
