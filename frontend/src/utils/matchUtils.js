export const calculateMatchPercentage = (currentUserPrefs, otherUserPrefs) => {
  if (!currentUserPrefs || !otherUserPrefs) return 0;

  const sanitize = (prefs) => {
    const array = Array.isArray(prefs)
      ? prefs
      : typeof prefs === 'string' ? prefs.split(",").map(p => p.trim()) : [];
    return array
      .filter(p => p && p.toLowerCase() !== "skipped" && p !== "")
      .map(p => p.toLowerCase());
  };

  const currentArray = sanitize(currentUserPrefs);
  const otherArray = sanitize(otherUserPrefs);

  if (currentArray.length === 0 || otherArray.length === 0) return 0;

  const common = otherArray.filter(pref => currentArray.includes(pref));
  
  const result = Math.round((common.length / currentArray.length) * 100);
  
  // Debug log to console to help identify issues
  if (result === 0 && currentArray.length > 0 && otherArray.length > 0) {
    console.log("Match trace:", { current: currentArray, other: otherArray, common });
  }

  return result;
};
