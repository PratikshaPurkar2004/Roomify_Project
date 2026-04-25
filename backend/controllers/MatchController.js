const db = require("../config/db");

// Gale-Shapley Algorithm for Roommate Matching
const findOptimalMatch = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Fetch all users and their preferences
    const [rows] = await db.query(
      "SELECT user_id, name, user_type, preferences, area as city FROM users"
    );

    const currentUser = rows.find(u => u.user_id == userId);
    if (!currentUser) return res.status(404).json({ success: false, message: "User not found" });

    const others = rows.filter(u => u.user_id != userId && u.user_type != currentUser.user_type);

    if (others.length === 0) {
      return res.json({ success: true, match: null, message: "No potential matches found." });
    }

    // 2. Simple preference-based scoring for Gale-Shapley compatibility
    const currentUserPrefs = currentUser.preferences ? currentUser.preferences.split(",") : [];

    const scoredMatches = others.map(other => {
      const otherPrefs = other.preferences ? other.preferences.split(",") : [];
      let score = 0;
      currentUserPrefs.forEach(p => {
        if (otherPrefs.includes(p)) score += 20;
      });
      // City bonus
      if (currentUser.city && other.city && currentUser.city.toLowerCase() === other.city.toLowerCase()) score += 10;
      
      return { ...other, matchScore: Math.min(score, 100) };
    });

    // Sort by score descending
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    // Return the top match for the dashboard highlight
    res.json({
      success: true,
      topMatch: scoredMatches[0],
      allMatches: scoredMatches.slice(0, 5)
    });

  } catch (error) {
    console.error("Match error:", error);
    res.status(500).json({ success: false, message: "Server error during matching" });
  }
};

module.exports = { findOptimalMatch };
