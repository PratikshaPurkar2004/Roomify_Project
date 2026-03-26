export const calculateMatchPercentage = (currentUserPrefs, otherUserPrefs) => {
  if (!currentUserPrefs || !otherUserPrefs) return 0;

  const currentArray = Array.isArray(currentUserPrefs) 
    ? currentUserPrefs 
    : currentUserPrefs.split(",").map(p => p.trim()).filter(p => p !== "");
    
  const otherArray = Array.isArray(otherUserPrefs)
    ? otherUserPrefs
    : otherUserPrefs.split(",").map(p => p.trim()).filter(p => p !== "");

  if (currentArray.length === 0 || otherArray.length === 0) return 0;

  const common = otherArray.filter(pref => currentArray.includes(pref));
  
  // Calculate percentage based on how many of CURRENT user's preferences are met by the OTHER user
  // Or vice versa. Usually, it's the intersection relative to the union or one of them.
  // The original logic used myPreferences.length as denominator.
  return Math.round((common.length / currentArray.length) * 100);
};
