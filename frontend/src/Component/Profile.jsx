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
    gender: ""
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {
        setForm(res.data);
      })
      .catch(() => {
        setMsg("Failed to load profile");
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
      })
      .catch(() => {
        setMsg("Update Failed ❌");
      });
  };

  const deleteProfile = () => {
    if (!window.confirm("Delete account?")) return;

    axios
      .delete(`http://localhost:5000/api/profile/${userId}`)
      .then(() => {
        localStorage.clear();
        window.location.href = "/";
      });
  };

  return (
    <div>
      <h2>My Profile</h2>
      {msg && <p>{msg}</p>}

      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="age_group" value={form.age_group} onChange={handleChange} placeholder="Age" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
      <input name="budget" value={form.budget} onChange={handleChange} placeholder="Budget" />
      <input name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" />

      <button onClick={saveProfile}>Save</button>
      <button onClick={deleteProfile}>Delete</button>
    </div>
  );
}