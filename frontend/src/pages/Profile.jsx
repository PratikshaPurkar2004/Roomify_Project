import { useState } from "react";
import "../styles/Profile.css";

export default function Profile() {

  const saved = JSON.parse(localStorage.getItem("profile")) || {};

  const [form, setForm] = useState({
    name: saved.name || "",
    age: saved.age || "",
    area: saved.area || "",
    budget: saved.budget || "",
    gender: saved.gender || "",
    photo: saved.photo || "",
    active: saved.active ?? true,
  });

  // Save
  const saveProfile = () => {
    localStorage.setItem("profile", JSON.stringify(form));
    alert("Profile saved ✅");
  };

  // Deactivate
  const deactivate = () => {
    const updated = { ...form, active: false };
    setForm(updated);
    localStorage.setItem("profile", JSON.stringify(updated));
  };

  // Delete
  const deleteProfile = () => {

    if (!window.confirm("Delete profile?")) return;

    localStorage.removeItem("profile");

    setForm({
      name: "",
      age: "",
      area: "",
      budget: "",
      gender: "",
      photo: "",
      active: true,
    });
  };

  // Image
  const handleImage = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({ ...form, photo: reader.result });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page">

      <h1 className="profile-title">Profile</h1>

      <div className="profile-box">

        {/* Left */}
        <div className="profile-left">

          {form.photo ? (
            <img src={form.photo} alt="User" />
          ) : (
            <div className="avatar">
              {form.name ? form.name[0] : "U"}
            </div>
          )}

          <h2>{form.name || "User Name"}</h2>

          {!form.active && (
            <span className="badge">Deactivated</span>
          )}

        </div>

        {/* Right */}
        <div className="profile-right">

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Area</label>
            <input
              type="text"
              value={form.area}
              onChange={(e) =>
                setForm({ ...form, area: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Budget</label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Photo</label>
            <input type="file" onChange={handleImage} />
          </div>

          {/* Buttons */}
          <div className="actions">

            <button
              className="btn-primary"
              onClick={saveProfile}
            >
              Save
            </button>

            <button
              className="btn-secondary"
              onClick={deactivate}
            >
              Deactivate
            </button>

            <button
              className="btn-danger"
              onClick={deleteProfile}
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
