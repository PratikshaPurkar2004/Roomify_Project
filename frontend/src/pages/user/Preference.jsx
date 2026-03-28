import React, { useState, useEffect } from "react";
import "../../styles/Preference.css";

const allPreferences = [
  { id: 1, name: "Night Owl", icon: "🦉" },
  { id: 2, name: "Early Bird", icon: "🦚" },
  { id: 3, name: "Studious", icon: "📚" },
  { id: 4, name: "Fitness Freak", icon: "🏋️" },
  { id: 5, name: "Sporty", icon: "⚽" },
  { id: 6, name: "Wanderer", icon: "🚗" },
  { id: 7, name: "Party Lover", icon: "🥳" },
  { id: 8, name: "Pet Lover", icon: "🐶" },
  { id: 9, name: "Vegan", icon: "🥗" },
  { id: 10, name: "Non Alcoholic", icon: "🚫🍺" },
  { id: 11, name: "Music Lover", icon: "🎸" },
  { id: 12, name: "Non Smoker", icon: "🚭" },
];

function Preference() {
  const [selected, setSelected] = useState([]);
  const [originalPrefs, setOriginalPrefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  // Fetch existing preferences on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/preferences/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.preferences) {
          const prefs = data.preferences
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
          setSelected(prefs);
          setOriginalPrefs(prefs);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching preferences:", err);
        setLoading(false);
      });
  }, []);

  const togglePreference = (name) => {
    setMsg({ text: "", type: "" });
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  const hasChanges =
    JSON.stringify([...selected].sort()) !==
    JSON.stringify([...originalPrefs].sort());

  const handleUpdate = async () => {
    if (selected.length === 0) {
      setMsg({ text: "Please select at least one preference", type: "error" });
      return;
    }

    setSaving(true);
    setMsg({ text: "", type: "" });

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        "http://localhost:5000/api/preferences/save-preferences",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, preferences: selected }),
        }
      );

      const data = await response.json();
      setOriginalPrefs([...selected]);
      setMsg({ text: "Preferences updated successfully! ✅", type: "success" });
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMsg({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelected([...originalPrefs]);
    setMsg({ text: "", type: "" });
  };

  if (loading) {
    return (
      <div className="pref-page">
        <div className="pref-loading">
          <div className="pref-spinner"></div>
          <p>Loading your preferences…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pref-page">
      <div className="pref-bg-shape pref-shape-1"></div>
      <div className="pref-bg-shape pref-shape-2"></div>

      <div className="pref-container">
        <div className="pref-header">
          <div className="pref-header-icon">🧩</div>
          <div>
            <h1>My Preferences</h1>
            <p className="pref-subtitle">
              Select the preferences that best describe your lifestyle.
              These help us find you the perfect roommate match.
            </p>
          </div>
        </div>

        {msg.text && (
          <div className={`pref-msg pref-msg-${msg.type}`}>{msg.text}</div>
        )}

        <div className="pref-count">
          <span className="pref-count-number">{selected.length}</span>
          <span className="pref-count-label">selected</span>
        </div>

        <div className="pref-grid">
          {allPreferences.map((item) => {
            const isActive = selected.includes(item.name);
            return (
              <div
                key={item.id}
                className={`pref-card ${isActive ? "active" : ""}`}
                onClick={() => togglePreference(item.name)}
                id={`pref-card-${item.id}`}
              >
                <div className="pref-icon">{item.icon}</div>
                <p>{item.name}</p>
                {isActive && <div className="pref-check">✓</div>}
              </div>
            );
          })}
        </div>

        <div className="pref-actions">
          {hasChanges && (
            <button
              className="pref-btn pref-btn-reset"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </button>
          )}
          <button
            className="pref-btn pref-btn-save"
            onClick={handleUpdate}
            disabled={saving || !hasChanges}
          >
            {saving ? (
              <>
                <span className="pref-btn-spinner"></span> Saving…
              </>
            ) : hasChanges ? (
              "Save Preferences"
            ) : (
              "No Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Preference;
