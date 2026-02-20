import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FindRoommate() {
  const navigate = useNavigate();

  // Logged-in user preference (example)
  const myPreference = {
    gender: "Female",
    city: "Mumbai",
    budget: 9000,
    habits: "Veg",
  };

  // Roommate Data
  const [users] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      gender: "Male",
      city: "Pune",
      budget: 7000,
      habits: "Non-Smoker",
      lookingFor: "findar",
      Age:25,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Neha Verma",
      gender: "Female",
      city: "Mumbai",
      budget: 9000,
      habits: "Veg",
      lookingFor: "roomate",
      Age:21,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Amit Patel",
      gender: "Male",
      city: "Delhi",
      budget: 6000,
      habits: "Smoker",
      lookingFor: "findar",
      Age:24,
      image: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      id: 4,
      name: "Priya Singh",
      gender: "Female",
      city: "Bangalore",
      budget: 8500,
      habits: "Non-Smoker",
      lookingFor: "roomate",
      Age:27,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ]);

  // Match Calculation
  const calculateMatch = (user) => {
    let score = 0;

    if (user.gender === myPreference.gender) score += 25;
    if (user.city === myPreference.city) score += 25;
    if (user.habits === myPreference.habits) score += 25;
    if (user.budget <= myPreference.budget) score += 25;

    return score;
  };

  return (
    <div className="find-container">

      <h1 className="page-title">Find Roommate</h1>

      {/* Search + Filters */}
      <div className="filter-box">

        <input placeholder="Search name / city" />

        <input placeholder="Max Budget" type="number" />

        <select>
          <option>Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <select>
          <option>Habits</option>
          <option>Veg</option>
          <option>Non-Smoker</option>
          <option>Smoker</option>
        </select>

      </div>

      {/* Cards */}
      <div className="card-grid">

        {users.map((u) => {
          const match = calculateMatch(u);

          return (
            <div key={u.id} className="user-card">

              {/* Match Badge */}
              <span className="match-badge">
                {match}% Match
              </span>

              {/* Profile Image */}
              <img
                src={u.image}
                alt={u.name}
                className="profile-img"
              />

              {/* Info */}
              <h3>{u.name}</h3>

              <p>Location:{u.city}</p>
              <p>Gender: {u.gender}</p>
              <p>Budget ₹{u.budget}</p>
              <p>Habits: {u.habits}</p>
              <p>Age: {u.Age}</p>
              <p>Looking for: {u.lookingFor}</p>

              {/* Buttons */}
              <div className="btn-group">

                <button
                  className="chat-btn"
                  onClick={() => navigate("/subscribe")}
                >
                  Chat
                </button>

                <button
                  className="req-btn"
                  onClick={() => navigate("/requests")}
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
