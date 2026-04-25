/**
 * Calculates a match percentage between two users based on lifestyle preferences,
 * budget compatibility, and location.
 */
export const calculateMatchPercentage = (currentUser, otherUser) => {
  if (!currentUser || !otherUser) return 0;

  // Extract preferences (handles both string and array formats)
  const getPrefs = (user) => {
    if (!user.preferences) return [];
    if (Array.isArray(user.preferences)) return user.preferences;
    return user.preferences.split(",").map(p => p.trim()).filter(Boolean);
  };

  const prefs1 = getPrefs(currentUser);
  const prefs2 = getPrefs(otherUser);

  if (prefs1.length === 0 || prefs2.length === 0) return 0;

  // Jaccard Similarity for preferences
  const intersection = prefs1.filter(p => prefs2.includes(p));
  const union = [...new Set([...prefs1, ...prefs2])];
  
  let score = (intersection.length / union.length) * 100;

  // Bonus for same city
  if (currentUser.city && otherUser.location && currentUser.city.toLowerCase() === otherUser.location.toLowerCase()) {
    score += 10;
  } else if (currentUser.city && otherUser.city && currentUser.city.toLowerCase() === otherUser.city.toLowerCase()) {
    score += 10;
  }

  // Budget compatibility (Finder looking at Host/Room)
  if (currentUser.user_type === 'Finder' && otherUser.user_type === 'Host') {
    const budget = Number(currentUser.budget || 0);
    const rent = Number(otherUser.rent || 0);
    if (rent > 0 && rent <= budget) {
        score += 15;
    } else if (rent > budget) {
        score -= 20;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};
