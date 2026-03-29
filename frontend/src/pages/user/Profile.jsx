import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import "../../styles/Profile.css";
import { useNavigate } from "react-router-dom";

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

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    name: "",
    age_group: "",
    city: "",
    budget: "",
    gender: ""
  });

  const [msg, setMsg] = useState("");
  // Preferences State
  const [selected, setSelected] = useState([]);
  const [originalPrefs, setOriginalPrefs] = useState([]);
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMsg, setPrefMsg] = useState({ text: "", type: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Fetch Profile
    axios
    .get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {
        if (res.data) {
          setForm({
            name: res.data.name || "",
            age_group: res.data.age_group || "",
            city: res.data.city || "",
            budget: res.data.budget || "",
            gender: res.data.gender || ""
          });
        }
      })
      .catch(() => {
        setMsg("Failed to load profile ❌");
      });

    // Fetch Preferences
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
      })
      .catch((err) => {
        console.error("Error fetching preferences:", err);
      });

  }, [userId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = () => {
    axios
      .put(`http://localhost:5000/api/profile/${userId}`, form)
      .then(() => {
        setMsg("Profile Updated Successfully ✅");
        
        // Update user data in localStorage so other components (like Header) can update
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.name = form.name;
        storedUser.gender = form.gender;
        localStorage.setItem("user", JSON.stringify(storedUser));
        
        // Dispatch a custom event to update the header if it listens, or just let them reload
        window.dispatchEvent(new Event("storage"));
      })
      .catch((err) => {
        console.log(err);
        setMsg("Update Failed ❌");
      });
  };

  const deleteProfile = () => {
    axios
      .delete(`http://localhost:5000/api/profile/${userId}`)
      .then(() => {
        localStorage.clear();
        window.location.href = "/";
      })
      .catch(() => {
        setMsg("Delete Failed ❌");
        setShowDeleteModal(false);
      });
  };

  // Preference Handlers
  const togglePreference = (name) => {
    setPrefMsg({ text: "", type: "" });
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  const hasPrefChanges =
    JSON.stringify([...selected].sort()) !==
    JSON.stringify([...originalPrefs].sort());

  const handleUpdatePreferences = async () => {
    if (selected.length === 0) {
      setPrefMsg({ text: "Please select at least one preference", type: "error" });
      return;
    }

    setPrefSaving(true);
    setPrefMsg({ text: "", type: "" });

    try {
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
      setPrefMsg({ text: "Preferences updated successfully! ✅", type: "success" });
    } catch (error) {
      console.error("Error saving preferences:", error);
      setPrefMsg({ text: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setPrefSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="prof-bg-shape prof-shape-1"></div>
      <div className="prof-bg-shape prof-shape-2"></div>
      <div className="profile-card">

        <h2>My Profile</h2>

        {msg && <p className="profile-msg">{msg}</p>}

        <div className="profile-form">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="age_group"
            placeholder="Age"
            value={form.age_group}
            onChange={handleChange}
          />

          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            value={form.dob || ""}
            onChange={handleChange}
          />

          <input
            name="occupation"
            placeholder="Occupation"
            value={form.occupation || ""}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />

          <input
            name="budget"
            type="number"
            placeholder="Budget"
            value={form.budget}
            onChange={handleChange}
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

        </div>

        <div className="profile-actions">
          <button className="btn-save" onClick={saveProfile}>
            Save / Update
          </button>

          <button className="btn-delete" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </button>
        </div>

        {/* Separator */}
        <div className="profile-separator"></div>

        {/* Preferences Section */}
        <div className="profile-preferences-section">
          <h3>My Lifestyle Preferences</h3>
          <p className="profile-pref-subtitle">
            These tags help us find you the most compatible roommates.
          </p>

          {prefMsg.text && (
            <div className={`pref-msg-inline pref-msg-${prefMsg.type}`}>
              {prefMsg.text}
            </div>
          )}

          <div className="profile-pref-grid">
            {allPreferences.map((item) => {
              const isActive = selected.includes(item.name);
              return (
                <div
                  key={item.id}
                  className={`profile-pref-card ${isActive ? "active" : ""}`}
                  onClick={() => togglePreference(item.name)}
                >
                  <div className="profile-pref-icon">{item.icon}</div>
                  <p>{item.name}</p>
                  {isActive && <div className="profile-pref-check">✓</div>}
                </div>
              );
            })}
          </div>

          <div className="profile-pref-actions">
            <button
              className="btn-save-pref"
              onClick={handleUpdatePreferences}
              disabled={prefSaving || !hasPrefChanges}
            >
              {prefSaving ? "Saving..." : hasPrefChanges ? "Update Preferences" : "No Changes"}
            </button>
          </div>
        </div>

      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="delete-modal-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="delete-modal-card"
            >
              <div className="modal-close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </div>
              <div className="modal-warning-icon">
                <AlertTriangle size={40} />
              </div>
              <h2>Delete Account?</h2>
              <p>This action is permanent and cannot be undone. All your data, roommates, and requests will be lost forever.</p>
              
              <div className="modal-action-btns">
                <button className="confirm-delete-btn" onClick={deleteProfile}>
                  <Trash2 size={18} /> Delete Forever
                </button>
                <button className="cancel-delete-btn" onClick={() => setShowDeleteModal(false)}>
                  I'll stay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
