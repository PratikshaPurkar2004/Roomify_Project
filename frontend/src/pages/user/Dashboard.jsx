import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";
import { Users, Home, FileText } from "lucide-react";

function Dashboard() {

  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    requests: 0,
  });

  const [hosts, setHosts] = useState([]);
  const [finders, setFinders] = useState([]);

  useEffect(() => {

    // Fetch dashboard stats
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));

    // Fetch hosts and finders
    fetch("http://localhost:5000/api/dashboard/users")
      .then((res) => res.json())
      .then((data) => {
        setHosts(data.hosts);
        setFinders(data.finders);
      })
      .catch((err) => console.error(err));

  }, []);

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Your platform summary</p>
      </div>

      {/* Stats Cards */}
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
{/* Hosts */}
<div className="user-section">
  <h2>Hosts</h2>

  <table className="user-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>City</th>
      </tr>
    </thead>
    <tbody>
      {hosts.map((host, index) => (
        <tr key={index}>
          <td>{host.name}</td>
          <td>{host.email}</td>
          <td>{host.city}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <h2 style={{ marginTop: "40px" }}>Finders</h2>

  <table className="user-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>City</th>
      </tr>
    </thead>
    <tbody>
      {finders.map((finder, index) => (
        <tr key={index}>
          <td>{finder.name}</td>
          <td>{finder.email}</td>
          <td>{finder.city}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>);
}

export default Dashboard;