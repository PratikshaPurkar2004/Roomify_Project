import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import "../../styles/Profile.css";

export default function Profile() {

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    if (!userId) return;

    axios
    .get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {
        if (res.data) {
          setForm({
            name: res.data.name || "",
            dob: res.data.DOB ? res.data.DOB.split('T')[0] : "", // Handle potential ISO string
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

  }, [userId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = () => {
    // Validation: Name should not contain numbers
    if (/\d/.test(form.name)) {
      showToast("Numbers are not allowed in name", "error");
      return;
    }

    // Map city to area for backend
    const payload = { ...form, area: form.city };
    
    axios
      .put(`http://localhost:5000/api/profile/${userId}`, payload)
      .then(() => {
        showToast("Profile Updated Successfully ✅", "success");
        
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="profile-page"
    >
      <div className="profile-wrapper">
        
        {/* TOAST NOTIFICATION */}
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
        
        {/* LEFT SIDE: PREMIUM PROFILE PREVIEW */}
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



          <div className="preview-actions">
             <button className="btn-main-save" onClick={saveProfile}>Save Changes</button>
             <button className="btn-light-delete" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
          </div>
        </motion.div>

        {/* RIGHT SIDE: EDIT FORM */}
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
             <h3>Preferences & Location</h3>
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
        </motion.div>

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
              <p>Your account will be deactivated and hidden immediately. After 30 days, it will be permanently deleted. You can cancel the deletion by logging back in within 30 days.</p>
              
              <div className="modal-action-btns">
                <button className="confirm-delete-btn" onClick={deleteProfile}>
                  <Trash2 size={18} /> Deactivate Account
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
