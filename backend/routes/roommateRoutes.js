const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all roommates
router.get("/", (req, res) => {

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

  db.query(sql, (err, results) => {

    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success:false,
        message:"Database error"
      });
    }

    res.json(results);

  });

});

module.exports = router;