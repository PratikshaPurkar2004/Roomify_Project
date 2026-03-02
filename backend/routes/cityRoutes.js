const express = require("express");
const router = express.Router();

// GET all cities
router.get("/", (req, res) => {
  res.json([
    { name: "Pune" },
    { name: "Mumbai" },
    { name: "Nashik" },
    // { name: "Delhi" },
    { name: "Bangalore" }
  ]);
});

module.exports = router;