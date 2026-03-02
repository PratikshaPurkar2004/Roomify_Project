import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/FindRoommates.css";

export default function FindRoommates() {
  const navigate = useNavigate();

  const [roommates, setRoommates] = useState([]);
  const [results, setResults] = useState([]);

  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");
  const [looking, setLooking] = useState("");

  // ✅ GET USER ID (because login saves userId only)
  const userId = localStorage.getItem("userId");

  // ✅ IF NO USER LOGGED IN
  if (!userId) {
    return <h2>Please login first 😔</h2>;
  }

  // 🔥 FETCH USERS FROM DATABASE
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/all/${userId}`)
      .then((res) => {
        setRoommates(res.data);
        setResults(res.data);
      })
      .catch((err) => {
        console.log("API Error:", err);
      });
  }, [userId]);

  // 🔎 SEARCH FUNCTION
  const handleSearch = () => {
    const filteredData = roommates.filter((u) => {
      return (
        (city === "" ||
          u.city.toLowerCase().includes(city.toLowerCase())) &&
        (budget === "" || u.budget <= Number(budget)) &&
        (gender === "" || u.gender === gender) &&
        (looking === "" || u.looking === looking)
      );
    });

    setResults(filteredData);
  };

  const handleRequest = (name) => {
    alert(`✅ Request sent successfully to ${name}!`);
  };

  return (
    <div className="clean-page">
      <h2 className="clean-title">Find Roommates</h2>

      {/* Search Section */}
      <div className="clean-search">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select value={looking} onChange={(e) => setLooking(e.target.value)}>
          <option value="">Looking For</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Any">Any</option>
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Cards */}
      <div className="clean-grid">
        {results.length === 0 && <p>No roommates found 😔</p>}

        {results.map((user) => (
          <div className="clean-card" key={user.user_id}>
            <img
              src={
                user.profile_image ||
                "https://randomuser.me/api/portraits/men/1.jpg"
              }
              alt={user.name}
            />

            <div className="clean-info">
              <h3>{user.name}</h3>

              <div className="card-info-box">
                <p><b>City:</b> {user.city}</p>
                <p><b>Budget:</b> ₹{user.budget}</p>
                <p><b>Looking:</b> {user.looking}</p>
              </div>

              <div className="clean-btns">
                <button
                  className="chat"
                  onClick={() => navigate("/subscribe")}
                >
                  Chat
                </button>

                <button
                  className="request"
                  onClick={() => handleRequest(user.name)}
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}