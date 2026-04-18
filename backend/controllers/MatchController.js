const db = require("../config/db");

<<<<<<< HEAD
// Gale-Shapley Algorithm for Roommate Matching
const findOptimalMatch = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Fetch all users and their preferences
    const [rows] = await db.query(
      "SELECT user_id, name, user_type, preferences, city FROM users"
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
      if (currentUser.city === other.city) score += 10;
      
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
=======
// Helper to calculate similarity score between 0 and 100
const calculateScore = (user1, user2) => {
    const prefs1 = (user1.preferences || "").split(",").map(p => p.trim()).filter(Boolean);
    const prefs2 = (user2.preferences || "").split(",").map(p => p.trim()).filter(Boolean);

    if (prefs1.length === 0 || prefs2.length === 0) return 0;

    const intersection = prefs1.filter(p => prefs2.includes(p));
    const union = [...new Set([...prefs1, ...prefs2])];

    // Jaccard similarity
    let score = (intersection.length / union.length) * 100;

    // Bonus for same city
    if (user1.city && user2.city && user1.city.toLowerCase() === user2.city.toLowerCase()) {
        score += 10;
    }

    // Budget check (for Finders looking at Hosts/Rooms)
    // If user1 is Finder and user2 is Host, check if user2's room rent fits user1's budget
    if (user1.user_type === 'Finder' && user2.user_type === 'Host') {
        const budget = user1.budget || 0;
        const rent = user2.rent || 0;
        if (rent > 0 && rent <= budget) {
            score += 15;
        } else if (rent > budget) {
            score -= 20;
        }
    }

    return Math.max(0, Math.min(100, Math.round(score)));
};

// Gale-Shapley Stable Matching Algorithm
const runGaleShapley = (finders, hosts) => {
    // 1. Precompute preference rankings
    const finderPrefs = {}; // finderId -> [hostId, hostId, ...] ranked by score
    const hostPrefs = {};   // hostId -> [finderId, finderId, ...] ranked by score

    finders.forEach(f => {
        const rankedHosts = [...hosts]
            .map(h => ({ id: h.user_id, score: calculateScore(f, h) }))
            .sort((a, b) => b.score - a.score)
            .map(h => h.id);
        finderPrefs[f.user_id] = rankedHosts;
    });

    hosts.forEach(h => {
        const rankedFinders = [...finders]
            .map(f => ({ id: f.user_id, score: calculateScore(h, f) }))
            .sort((a, b) => b.score - a.score)
            .map(f => f.id);
        hostPrefs[h.user_id] = rankedFinders;
    });

    const freeFinders = finders.map(f => f.user_id);
    const hostEngagements = {}; // hostId -> engagedFinderId
    const finderProposals = {}; // finderId -> index of next host to propose to

    finders.forEach(f => {
        finderProposals[f.user_id] = 0;
    });

    while (freeFinders.length > 0) {
        const fId = freeFinders.shift();
        const fRankedHosts = finderPrefs[fId];
        const nextHostIdx = finderProposals[fId];

        if (nextHostIdx >= fRankedHosts.length) {
            // This finder has proposed to all hosts and been rejected by all
            continue;
        }

        const hId = fRankedHosts[nextHostIdx];
        finderProposals[fId]++;

        if (!hostEngagements[hId]) {
            // Host is free
            hostEngagements[hId] = fId;
        } else {
            // Host is already engaged
            const currentFId = hostEngagements[hId];
            const hRankedFinders = hostPrefs[hId];

            const currentRank = hRankedFinders.indexOf(currentFId);
            const newRank = hRankedFinders.indexOf(fId);

            if (newRank < currentRank) {
                // Host prefers new finder
                hostEngagements[hId] = fId;
                freeFinders.push(currentFId);
            } else {
                // Host prefers current finder
                freeFinders.push(fId);
            }
        }
    }

    // Convert to map of userId -> matchId
    const finalMatches = {};
    for (const hId in hostEngagements) {
        const fId = hostEngagements[hId];
        finalMatches[hId] = parseInt(fId);
        finalMatches[fId] = parseInt(hId);
    }

    return finalMatches;
};

exports.getMatchResults = async (req, res) => {
    try {
        const currentUserId = parseInt(req.params.userId);

        // Fetch all users with their preferences and room info (if host)
        const sql = `
            SELECT 
                u.user_id, u.name, u.user_type, u.preferences, u.city, u.budget,
                (SELECT MIN(rent) FROM rooms WHERE host_id = u.user_id) as rent
            FROM users u
        `;
        const [users] = await db.query(sql);

        const currentUser = users.find(u => u.user_id === currentUserId);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const finders = users.filter(u => u.user_type === 'Finder');
        const hosts = users.filter(u => u.user_type === 'Host');

        let stableMatches = {};
        if (finders.length > 0 && hosts.length > 0) {
            stableMatches = runGaleShapley(finders, hosts);
        }

        const matchedId = stableMatches[currentUserId] || null;
        let bestMatch = null;

        if (matchedId) {
            const matchedUser = users.find(u => u.user_id === matchedId);
            if (matchedUser) {
                bestMatch = {
                    id: matchedUser.user_id,
                    name: matchedUser.name,
                    user_type: matchedUser.user_type,
                    location: matchedUser.city,
                    score: calculateScore(currentUser, matchedUser),
                    preferences: matchedUser.preferences
                };
            }
        }

        // Also return a few "High Compatibility" alternatives
        const others = users.filter(u => u.user_id !== currentUserId && u.user_type !== currentUser.user_type);
        const recommendations = others
            .map(u => ({
                id: u.user_id,
                name: u.name,
                user_type: u.user_type,
                location: u.city,
                score: calculateScore(currentUser, u),
                preferences: u.preferences
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return res.json({
            success: true,
            bestMatch,
            recommendations
        });

    } catch (err) {
        console.error("Match error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
>>>>>>> 9f483a8 (feat: implement matching system and UI updates)
