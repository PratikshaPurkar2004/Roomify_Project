import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Profile.css";

export default function Profile() {

  // get userId safely
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    name: "",
    age_group: "",
    city: "",
    budget: "",
    gender: ""
  });

  const [msg, setMsg] = useState("");

  // ================= FETCH PROFILE =================
  useEffect(() => {

    if (!userId) {
      setMsg("User not logged in ❌");
      return;
    }

    axios
      .get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {

        const data = res.data;

        setForm({
          name: data.name || "",
          age_group: data.age_group || "",
          city: data.city || "",
          budget: data.budget || "",
          gender: data.gender || ""
        });

      })
      .catch((err) => {
        console.log(err);
        setMsg("Failed to load profile ❌");
      });

  }, [userId]);


  // ================= HANDLE INPUT =================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };


  // ================= UPDATE PROFILE =================
  const saveProfile = () => {

    if (!userId) {
      setMsg("User not logged in ❌");
      return;
    }

    axios
      .put(`http://localhost:5000/api/profile/${userId}`, form)
      .then(() => {

        setMsg("Profile Updated Successfully ✅");

      })
      .catch((err) => {

        console.log(err);
        setMsg("Update Failed ❌");

      });

  };


  // ================= DELETE ACCOUNT =================
  const deleteProfile = () => {

    if (!window.confirm("Are you sure you want to delete account?")) return;

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
            placeholder="Age"
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
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

        </div>

        <div className="profile-actions">

          <button
            className="btn-save"
            onClick={saveProfile}
          >
            Save / Update
          </button>

          <button
            className="btn-delete"
            onClick={deleteProfile}
          >
            Delete Account
          </button>

        </div>

      </div>

    </div>
  );
}