import React from "react";
import "../styles/FindRoomates.css";

export default function FindRoommate() {

  const roommates = [
    {
      id: 1,
      name: "Rahul Sharma",
      city: "Pune",
      gender: "Male",
      budget: 7000,
      age: 25,
      match: 25,
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Neha Verma",
      city: "Mumbai",
      gender: "Female",
      budget: 9000,
      age: 21,
      match: 100,
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Amit Patel",
      city: "Delhi",
      gender: "Male",
      budget: 6000,
      age: 24,
      match: 50,
      img: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      id: 4,
      name: "Priya Singh",
      city: "Bangalore",
      gender: "Female",
      budget: 8500,
      age: 27,
      match: 50,
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  return (
    <div className="roommate-container">

      <h1 className="page-title">Find Roommate</h1>

      <div className="roommate-grid">

        {roommates.map((user) => (
          <div className="roommate-card" key={user.id}>

            <div className="match-badge">
              {user.match}% Match
            </div>

            <img
              src={user.img}
              alt={user.name}
              className="roommate-img"
            />

            <h3>{user.name}</h3>

            <p>📍 {user.city}</p>
            <p>👤 {user.gender}</p>
            <p>💰 ₹{user.budget}</p>
            <p>🎂 {user.age} Years</p>

            <div className="card-btns">

              <button className="chat-btn">
                Chat
              </button>

              <button className="req-btn">
                Request
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
