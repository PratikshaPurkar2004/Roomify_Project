// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");

// // GET Dashboard Stats
// router.get("/stats", (req, res) => {
//   const sql = `
//     SELECT 
//       (SELECT COUNT(*) FROM users) AS users,
//       (SELECT COUNT(*) FROM rooms) AS rooms,
//       (SELECT COUNT(*) FROM requests) AS requests
//   `;

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error("Dashboard Error:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     res.json(result[0]);
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/stats", async (req, res) => {
  try {

    const [users] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [rooms] = await db.query("SELECT COUNT(*) AS total FROM rooms");
    const [requests] = await db.query("SELECT COUNT(*) AS total FROM connect");

    res.json({
      users: users[0].total,
      rooms: rooms[0].total,
      requests: requests[0].total
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;