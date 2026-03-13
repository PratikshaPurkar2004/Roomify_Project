import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FindRoommates.css";

export default function FindRoommates() {

  const navigate = useNavigate();

  const [roommates, setRoommates] = useState([]);
  const [results, setResults] = useState([]);

  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");

  const [myPreferences, setMyPreferences] = useState([]);

  // Fetch logged in user preferences
  useEffect(() => {

    const userId = localStorage.getItem("userId");

    if (!userId) return;

    fetch(`http://localhost:5000/api/preferences/${userId}`)
      .then(res => res.json())
      .then(data => {

        if (data && data.preferences) {
          const prefs = data.preferences.split(",").map(p => p.trim());
          setMyPreferences(prefs);
        }

      })
      .catch(err => console.error(err));

  }, []);

  // Fetch roommates
  useEffect(() => {

    fetch("http://localhost:5000/api/roommates")
      .then(res => res.json())
      .then(data => {
        setRoommates(data);
        setResults(data);
      })
      .catch(err => console.error(err));

  }, []);

  // Match percentage calculation
  const calculateMatch = (userPrefs) => {

    if (!userPrefs || myPreferences.length === 0) return 0;

    const prefsArray = userPrefs.split(",").map(p => p.trim());

    const common = prefsArray.filter(pref =>
      myPreferences.includes(pref)
    );

    return Math.round((common.length / myPreferences.length) * 100);
  };

  // Search filter
  const handleSearch = () => {

    const filtered = roommates.filter(user => {

      return (
        (city === "" ||
          user.location.toLowerCase().includes(city.toLowerCase())) &&
        (budget === "" || user.rent <= Number(budget)) &&
        (gender === "" || user.gender === gender)
      );

    });

    setResults(filtered);
  };

  const handleRequest = (name) => {
    alert(`Roommate request sent to ${name}`);
  };

  return (

    <div className="roommate-page">

      <h2 className="title">Find Your Perfect Roommate</h2>

      {/* Search Bar */}
      <div className="search-box">

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e)=>setCity(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Budget"
          value={budget}
          onChange={(e)=>setBudget(e.target.value)}
        />

        <select
          value={gender}
          onChange={(e)=>setGender(e.target.value)}
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button onClick={handleSearch}>
          Search
        </button>

      </div>


      {/* Roommate Cards */}

      <div className="roommate-grid">

        {results.length === 0 && (
          <p>No roommates found</p>
        )}

        {results.map((user) => {

          const match = calculateMatch(user.preferences || "");

          return (

            <div className="roommate-card" key={user.id}>

              <div className="card-header">

                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="avatar"
                />

                <div className="card-user">
                  <h3>{user.name}</h3>
                  <p className="city">{user.location}</p>
                </div>

                <div className="match-badge">
                  {match}% Match
                </div>

              </div>


              <div className="card-body">

                <div className="info-row">
                  <span>Budget</span>
                  <strong>₹{user.rent}</strong>
                </div>

                <div className="info-row">
                  <span>Gender</span>
                  <strong>{user.gender}</strong>
                </div>

                <div className="info-row">
                  <span>Looking For</span>
                  <strong>{user.user_type}</strong>
                </div>

              </div>


              <div className="card-footer">

                <button
                  className="chat-btn"
                  onClick={()=>navigate("/subscribe")}
                >
                  Chat
                </button>

                <button
                  className="request-btn"
                  onClick={()=>handleRequest(user.name)}
                >
                  Request
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );
}