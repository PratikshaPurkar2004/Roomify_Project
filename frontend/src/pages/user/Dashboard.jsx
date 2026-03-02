import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";
import { Users, Home, FileText } from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    requests: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Your platform summary</p>
      </div>

      <div className="card-row">
        <div className="card">
          <div className="card-icon users">
            <Users size={24} />
          </div>
          <div>
            <p>Total Users</p>
            <h2>{stats.users}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon rooms">
            <Home size={24} />
          </div>
          <div>
            <p>Total Rooms</p>
            <h2>{stats.rooms}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon requests">
            <FileText size={24} />
          </div>
          <div>
            <p>Total Requests</p>
            <h2>{stats.requests}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;