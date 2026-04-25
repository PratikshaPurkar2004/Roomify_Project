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
    dob: "",
    occupation: "",
    city: "",
    budget: "",
    gender: ""
  });

  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [msg, setMsg] = useState("");
  
  // Preferences State
  const [selected, setSelected] = useState([]);
  const [originalPrefs, setOriginalPrefs] = useState([]);
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMsg, setPrefMsg] = useState({ text: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    if (!userId) return;

    // Fetch Profile
    axios
    .get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {
        if (res.data) {
          setForm({
            name: res.data.name || "",
            dob: res.data.DOB ? res.data.DOB.split('T')[0] : "",
            occupation: res.data.occupation || "",
            city: res.data.area || "",
            budget: res.data.budget || "",
            gender: res.data.gender || ""
          });
        }
      })
      .catch(() => {
        showToast("Failed to load profile", "error");
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
    if (/\d/.test(form.name)) {
      showToast("Numbers are not allowed in name", "error");
      return;
    }

    const payload = { ...form, area: form.city };
    
    axios
      .put(`http://localhost:5000/api/profile/${userId}`, payload)
      .then(() => {
        showToast("Profile Updated Successfully ✅", "success");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.name = form.name;
        storedUser.gender = form.gender;
        localStorage.setItem("user", JSON.stringify(storedUser));
        window.dispatchEvent(new Event("storage"));
      })
      .catch((err) => {
        console.log(err);
        showToast("Update Failed ❌", "error");
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
        showToast("Delete Failed ❌", "error");
        setShowDeleteModal(false);
      });
  };

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="profile-page"
    >
      <div className="profile-wrapper">
        
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
                <strong>{toast.type === 'success' ? 'Success!' : 'Update Notice'}</strong>
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
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="profile-preview-card"
        >
          <div className="preview-header">
             <div className="avatar-circle">
                {form.name.charAt(0).toUpperCase()}
             </div>
             <h2>{form.name || "Your Name"}</h2>
             <span className="occupation-badge">{form.occupation || "Occupation"}</span>
          </div>

          <div className="preview-stats">
             <div className="p-stat">
                <span className="p-label">City</span>
                <span className="p-val">{form.city || "Not set"}</span>
             </div>
             <div className="p-stat">
                <span className="p-label">Budget</span>
                <span className="p-val">₹{form.budget || "0"}</span>
             </div>
          </div>

          <div className="preview-actions">
             <button className="btn-main-save" onClick={saveProfile}>Save Changes</button>
             <button className="btn-light-delete" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="profile-edit-form"
        >
          <div className="form-section">
             <h3>Personal Details</h3>
             <div className="input-group-grid">
                <div className="input-box">
                   <label>Full Name</label>
                   <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" />
                </div>
                <div className="input-box">
                   <label>Birth Date</label>
                   <input type="date" name="dob" value={form.dob} onChange={handleChange} />
                </div>
                <div className="input-box">
                   <label>Occupation</label>
                   <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="e.g. Designer, Student" />
                </div>
                <div className="input-box">
                   <label>Gender</label>
                   <select name="gender" value={form.gender} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                   </select>
                </div>
             </div>
          </div>

          <div className="form-section">
             <h3>Location & Budget</h3>
             <div className="input-group-grid">
                <div className="input-box">
                   <label>City / Location</label>
                   <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Pune" />
                </div>
                <div className="input-box">
                   <label>Max Budget (₹)</label>
                   <input name="budget" type="number" value={form.budget} onChange={handleChange} placeholder="Monthly budget" />
                </div>
             </div>
          </div>

          <div className="profile-separator-inner"></div>

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
        </motion.div>


      </div>

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
    </motion.div>
  );
}
