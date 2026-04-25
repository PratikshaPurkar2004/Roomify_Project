const express = require("express");
const router = express.Router();

// Mock city data as requested by the frontend
router.get("/", (req, res) => {
  const cities = ["Mumbai", "Pune", "Nashik", "Hyderabad", "Bangalore", "Delhi"];
  res.json({
    success: true,
    cities: cities
  });
});

module.exports = router;
