// routes/profileRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");


router.get("/:id", (req, res) => {

  const userId = req.params.id;

  const sql = `
    SELECT 
      users.name,
      users.age_group,
      users.city,
      rooms.rent AS budget,
      users.gender
    FROM users
    LEFT JOIN rooms ON users.user_id = rooms.host_id
    WHERE users.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {

    if (err) {
      console.log("GET ERROR:", err);
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);

  });

});


router.put("/:id", (req, res) => {

  const userId = req.params.id;

  const { name, age_group, city, budget, gender } = req.body;

  // Update users table
  const userSql = `
    UPDATE users
    SET name=?, age_group=?, city=?, gender=?
    WHERE user_id=?
  `;

  db.query(userSql, [name, age_group, city, gender, userId], (err) => {

    if (err) {
      console.log("USER UPDATE ERROR:", err);
      return res.status(500).json(err);
    }

    // Update rooms table (rent)
    const roomSql = `
      UPDATE rooms
      SET rent=?
      WHERE host_id=?
    `;

    db.query(roomSql, [budget, userId], (err2) => {

      if (err2) {
        console.log("ROOM UPDATE ERROR:", err2);
        return res.status(500).json(err2);
      }

      res.json({ message: "Profile Updated Successfully" });

    });

  });

});


router.delete("/:id", (req, res) => {

  const userId = req.params.id;

  db.query(
    "DELETE FROM users WHERE user_id=?",
    [userId],
    (err) => {

      if (err) {
        console.log("DELETE ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Account Deleted Successfully" });

    }
  );

});


module.exports = router;
