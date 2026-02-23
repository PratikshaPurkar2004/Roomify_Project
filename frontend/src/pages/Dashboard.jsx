import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {

  // Store data from backend
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    requests: 0,
  });

  // Fetch data when page loads
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data); // save backend data
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      });
  }, []);

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      <div className="card-row">

        <div className="card">
          <p>Users</p>
          <h2>{stats.users}</h2>
        </div>

        <div className="card">
          <p>Rooms</p>
          <h2>{stats.rooms}</h2>
        </div>

        <div className="card">
          <p>Requests</p>
          <h2>{stats.requests}</h2>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;