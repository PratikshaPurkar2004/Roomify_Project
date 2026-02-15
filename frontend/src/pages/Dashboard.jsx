import React from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      <div className="card-row">

        <div className="card">
          <p>Users</p>
          <h2>120</h2>
        </div>

        <div className="card">
          <p>Rooms</p>
          <h2>45</h2>
        </div>

        <div className="card">
          <p>Requests</p>
          <h2>8</h2>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
