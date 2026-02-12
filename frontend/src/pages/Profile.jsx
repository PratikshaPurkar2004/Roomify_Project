import { useState, useEffect } from "react";

export default function Profile() {

  // load saved profile (localStorage)
  const saved = JSON.parse(localStorage.getItem("profile")) || {};

  const [form, setForm] = useState({
    name: saved.name || "",
    age: saved.age || "",
    area: saved.area || "",
    budget: saved.budget || "",
    gender: saved.gender || "",
    habits: saved.habits || "",
    photo: saved.photo || "",
  });

  // save to localStorage
  const saveProfile = () => {
    localStorage.setItem("profile", JSON.stringify(form));
    alert("Saved!");
  };

  const deactivate = () => {
    setForm({ ...form, active: false });
    localStorage.setItem("profile", JSON.stringify({ ...form, active: false }));
  };

  const deleteProfile = () => {
    localStorage.removeItem("profile");
    setForm({
      name: "", age: "", area: "",
      budget: "", gender: "", habits: "", photo: "",
      active: false,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page">

      <h1>My Profile</h1>

      <div className="profile-wrap">

        {/* Photo Card */}
        <div className="profile-card">

          {form.photo ? (
            <img src={form.photo} alt="Photo" className="profile-img" />
          ) : (
            <div className="profile-img placeholder">U</div>
          )}

          <h2>{form.name || "No Name"}</h2>

          {form.age && <p><b>Age:</b> {form.age}</p>}
          {form.area && <p><b>Area:</b> {form.area}</p>}
          {form.budget && <p><b>Budget:</b> ₹{form.budget}</p>}
          {form.gender && <p><b>Gender:</b> {form.gender}</p>}
          {form.habits && <p><b>Habits:</b> {form.habits}</p>}

          {form.active === false && (
            <p className="deactivated">Deactivated</p>
          )}

        </div>

        {/* Edit Form */}
        <div className="profile-edit">

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <input
            type="text"
            placeholder="Area"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />

          <input
            type="number"
            placeholder="Budget"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />

          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={form.habits}
            onChange={(e) => setForm({ ...form, habits: e.target.value })}
          >
            <option value="">Habits</option>
            <option value="Smoker">Smoker</option>
            <option value="Non-Smoker">Non-Smoker</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>

          <div className="profile-btns">
            <button className="btn save" onClick={saveProfile}>
              Save
            </button>

            <button className="btn deactivate" onClick={deactivate}>
              Deactivate
            </button>

            <button className="btn delete" onClick={deleteProfile}>
              Delete
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
