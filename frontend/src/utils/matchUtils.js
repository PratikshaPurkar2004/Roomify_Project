/**
 * Calculates a "Real-Web" match percentage.
 * Generous algorithm that rewards profile completeness and provides realistic, high-quality variety.
 */
export const calculateMatchPercentage = (currentUser, otherUser) => {
  if (!currentUser || !otherUser) return 40; // Default realistic base

  // Extract preferences helper
  const getPrefs = (data) => {
    if (!data) return [];
    const raw = (typeof data === "object" && !Array.isArray(data)) ? data.preferences : data;
    if (!raw) return [];
    let arr = Array.isArray(raw) ? raw : String(raw).split(",");
    return arr.map(p => String(p).trim()).filter(p => p && p.toLowerCase() !== "none" && p.toLowerCase() !== "skipped" && p !== "[]");
  };

  const prefs1 = getPrefs(currentUser);
  const prefs2 = getPrefs(otherUser);

  // 1. BASE "REAL-WEB" SCORE (Starts at 30-40% to make the app look healthy)
  let score = 30; 
  
  // 2. Profile Completeness Reward (Up to +30%)
  // This makes the best profiles (like Shraddha) show high percentages
  if (prefs2.length > 3) score += 15;
  if (otherUser.location && otherUser.location !== "Not specified") score += 10;
  if (otherUser.rent && otherUser.rent !== "N/A") score += 5;

  // 3. Location Matching (+20%)
  const city1 = String(currentUser.city || currentUser.location || "").toLowerCase().trim();
  const city2 = String(otherUser.city || otherUser.location || "").toLowerCase().trim();
  if (city1 && city2 && city1 !== "not specified" && (city1 === city2 || city1.includes(city2) || city2.includes(city1))) {
    score += 20;
  } else if (!city1 || city1 === "not specified") {
    // If current user hasn't set city, give a "Regional Discovery" bonus
    score += 10;
  }

  // 4. Budget Compatibility (+10%)
  const budget = Number(currentUser.budget || currentUser.rent || 0);
  const rent   = Number(otherUser.budget || otherUser.rent || 0);
  if (budget > 0 && rent > 0 && Math.abs(budget - rent) / ((budget + rent) / 2) < 0.4) {
    score += 10;
  }

  // 5. Lifestyle Preference Matching (+10% per match)
  const intersection = prefs1.filter(p => {
    return prefs2.some(p2 => p.toLowerCase() === p2.toLowerCase());
  });
  score += (intersection.length * 10);

  // 6. Final "Chemistry" Polish
  // If the user's profile is empty, we still want to show a variety of high scores
  if (prefs1.length === 0) {
    // Add a unique factor based on the other user's ID to keep it consistent but varied
    const salt = (String(otherUser.id || otherUser.user_id || "").length % 3) * 5;
    score += salt;
  }

  // Round to nearest 5 or 10 for a professional look
  const finalScore = Math.round(score / 5) * 5;

  return Math.max(30, Math.min(95, finalScore));
};
