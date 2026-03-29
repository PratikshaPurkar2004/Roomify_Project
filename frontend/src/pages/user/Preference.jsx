import React, { useState } from "react";
import "../../styles/Preference.css";
import { useNavigate } from "react-router-dom";

const preferences = [
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

  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Toggle preference selection
  const togglePreference = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  // Save preferences to backend
  const handleUpdate = async () => {

    if (selected.length === 0) {
      showToast("Please select at least one preference", "error");
      return;
    }

    try {

      const userId = localStorage.getItem("userId");

      const response = await fetch("http://localhost:5000/api/preferences/save-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          preferences: selected
        })
      });

      const data = await response.json();

      showToast(data.message || "Preferences updated!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Error saving preferences:", error);
      showToast("Something went wrong", "error");
    }

  };

  return (
    <div className="pref-container">
      
      {toast && (
        <div className={`pref-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <h1>Your Preferences</h1>
      <p>Select preferences that describe you</p>

      <div className="pref-grid">
        {preferences.map((item) => (
          <div
            key={item.id}
            className={`pref-card ${selected.includes(item.name) ? "active" : ""}`}
            onClick={() => togglePreference(item.name)}
          >
            <div className="pref-icon">{item.icon}</div>
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <button className="pref-btn" onClick={handleUpdate}>
        Update Preferences
      </button>

    </div>
  );
}

export default Preference;
