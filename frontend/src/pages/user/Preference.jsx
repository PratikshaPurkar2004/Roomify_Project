import React, { useState } from "react";
import "../../styles/Preference.css";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../../Component/HomeNavbar";

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

import { motion, AnimatePresence } from "framer-motion";

function Preference() {

  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
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
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userObj.preferences = selected.join(",");
          localStorage.setItem("user", JSON.stringify(userObj));
        } catch (e) {}
      }

      showToast(data.message || "Preferences updated!", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);

    } catch (error) {
      console.error("Error saving preferences:", error);
      showToast("Something went wrong", "error");
    }

  };

  const handleSkip = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const skipPref = "skipped";
      await fetch("http://localhost:5000/api/preferences/save-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, preferences: [skipPref] })
      });

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userObj.preferences = skipPref;
          localStorage.setItem("user", JSON.stringify(userObj));
        } catch (e) {}
      }
      
      showToast("Preferences skipped", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error skipping preferences:", error);
      navigate("/dashboard");
    }
  };

  return (
    <div className="pref-page">
      <HomeNavbar isSimple={true} />
      
      <div className="pref-container">
        
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className={`pref-toast ${toast.type}`}
            >
              <span className="toast-icon">{toast.type === 'success' ? '✨' : '⚠️'}</span>
              <div className="toast-content">
                <strong>{toast.type === 'success' ? 'Success!' : 'Notice'}</strong>
                <p>{toast.message}</p>
              </div>
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="toast-progress" 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <h1>Your Preferences</h1>
        <p>Select preferences that describe you to find the best matches.</p>

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

        <div className="pref-footer">
          <button className="pref-btn" onClick={handleUpdate}>
            Update Preferences
          </button>
          <button className="pref-btn btn-skip" onClick={handleSkip}>
            Skip for Now
          </button>
        </div>

      </div>

    </div>
  );
}

export default Preference;
