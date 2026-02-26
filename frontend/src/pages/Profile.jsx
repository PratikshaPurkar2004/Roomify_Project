import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

export default function Profile() {
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    name: "",
    age_group: "",
    city: "",
    budget: "",
    gender: "",
    preferences: "",
  });

  const [msg, setMsg] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {
        setForm(res.data);
      })
      .catch(() => {
        setMsg("Failed to load profile ❌");
      });
  }, [userId]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SAVE =================
  const saveProfile = () => {
    axios
      .put(`http://localhost:5000/api/profile/${userId}`, form)
      .then(() => {
        setMsg("Profile Updated Successfully ✅");
      })
      .catch(() => {
        setMsg("Update Failed ❌");
      });
  };

  // ================= DELETE =================
  const deleteProfile = () => {
    if (!window.confirm("Are you sure?")) return;

    axios
      .delete(`http://localhost:5000/api/profile/${userId}`)
      .then(() => {
        localStorage.clear();
        window.location.href = "/";
      })
      .catch(() => {
        setMsg("Delete Failed ❌");
      });
  };

  return (
    <div className="profile-page">
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
            placeholder="Age Group (18-25)"
            value={form.age_group}
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
            <option>Male</option>
            <option>Female</option>
          </select>

          <textarea
            name="preferences"
            placeholder="Preferences"
            value={form.preferences}
            onChange={handleChange}
          />

        </div>

        <div className="profile-actions">
          <button className="btn-save" onClick={saveProfile}>
            Save / Update
          </button>

          <button className="btn-delete" onClick={deleteProfile}>
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}