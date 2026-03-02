import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FindRoommates.css";

export default function FindRoommates() {

  const navigate = useNavigate();

  // Roommates Data
  const roommates = [
    {
      id: 1,
      name: "Neha Patil",
      city: "Pune",
      rent: 9000,
      gender: "Female",
      lookingFor: "Female",
      match: 92,
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      city: "Mumbai",
      rent: 7000,
      gender: "Male",
      lookingFor: "Male",
      match: 85,
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Amit Patel",
      city: "Delhi",
      rent: 6000,
      gender: "Male",
      lookingFor: "Any",
      match: 78,
      img: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      id: 4,
      name: "Priya Singh",
      city: "Bangalore",
      rent: 8500,
      gender: "Female",
      lookingFor: "Female",
      match: 88,
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 5,
      name: "Rohan Verma",
      city: "Delhi",
      rent: 7500,
      gender: "Male",
      lookingFor: "Any",
      match: 80,
      img: "https://randomuser.me/api/portraits/men/71.jpg",
    },
    {
      id: 6,
      name: "Sneha Kulkarni",
      city: "Pune",
      rent: 8200,
      gender: "Female",
      lookingFor: "Female",
      match: 90,
      img: "https://randomuser.me/api/portraits/women/72.jpg",
    },
  ];

  // Search States
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");
  const [looking, setLooking] = useState("");
  const [results, setResults] = useState(roommates);

  // Search Function
  const handleSearch = () => {
    const filteredData = roommates.filter((u) => {
      return (
        (city === "" ||
          u.city.toLowerCase().includes(city.toLowerCase())) &&

        (budget === "" || u.rent <= Number(budget)) &&

        (gender === "" || u.gender === gender) &&

        (looking === "" || u.lookingFor === looking)
      );
    });

    setResults(filteredData);
  };

  // Request Success Alert
  const handleRequest = (name) => {
    alert(`✅ Request sent successfully to ${name}!\nThey will contact you soon.`);
  };

  return (
    <div className="clean-page">

      <h2 className="clean-title">Find Roommates</h2>

      {/* Search Bar */}
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

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          value={looking}
          onChange={(e) => setLooking(e.target.value)}
        >
          <option value="">Looking For</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Any">Any</option>
        </select>

        <button onClick={handleSearch}>Search</button>

      </div>

      {/* Cards */}
      <div className="clean-grid">

        {results.length === 0 && (
          <p>No roommates found 😔</p>
        )}

        {results.map((user) => (

          <div className="clean-card" key={user.id}>

            {/* Match Badge */}
            <div className="match-badge">
              {user.match}% Match
            </div>

            <img src={user.img} alt={user.name} />

            <div className="clean-info">

              <h3>{user.name}</h3>

              <div className="card-info-box">
                <p><b>City:</b> {user.city}</p>
                <p><b>Budget:</b> ₹{user.rent}</p>
                <p><b>Looking:</b> {user.lookingFor}</p>
              </div>

              {/* Buttons */}
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