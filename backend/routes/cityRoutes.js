const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET popular cities from rooms and users tables
router.get('/', async (req, res) => {
  try {
    // Get distinct cities from rooms (locations where rooms exist)
    const [roomLocations] = await db.query(`
      SELECT DISTINCT location AS city 
      FROM rooms 
      WHERE location IS NOT NULL AND location != ''
    `);

    let cities = roomLocations.map(row => row.city);

    // If there are fewer than 4 cities, we can append static popular cities to have a nice UI
    const defaultCities = ['Mumbai', 'Pune', 'Nashik', 'Hyderabad', 'Bangalore', 'Delhi'];
    
    // Fill up the list if not enough dynamic cities
    for (const city of defaultCities) {
      if (!cities.includes(city)) {
        cities.push(city);
      }
    }

    // Return exactly 4 cities for the popular cities grid
    res.json({
      success: true,
      cities: cities.slice(0, 4)
    });

  } catch (error) {
    console.error("Fetch cities error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
