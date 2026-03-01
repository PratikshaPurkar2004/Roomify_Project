import React, { useState } from "react";
import RoomCard from "../Component/RoomCard";
import { roomData } from "../roomData";
import "../styles/Home.css";

function Home() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredRooms = roomData.filter((room) => {
    const genderMatch =
      filter === "All" ? true : room.gender === filter;

    const searchMatch =
      room.location.toLowerCase().includes(search.toLowerCase());

    return genderMatch && searchMatch;
  });

  return (
    <div className="home">

      {/* Header */}
      <header className="header">
        <h2 className="logo">Roomify</h2>
        <button className="login-btn">Login / Register</button>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Find Perfect Roommates in Pune</h1>
        <p>No brokers. Verified profiles. Safe & Easy.</p>

        <div className="search-filter-row">
          <input
            type="text"
            placeholder="Search by area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      <div className="room-list">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

    </div>
  );
}

export default Home;