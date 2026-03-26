import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";
import { Users, Home, FileText, UserPlus, UserSearch } from "lucide-react";
import { calculateMatchPercentage } from "../../utils/matchUtils";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    requests: 0,
    hosts: 0,
    finders: 0,
  });

  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [myPreferences, setMyPreferences] = useState([]);

  const hosts = users.filter((u) => u.user_type === "Host");
  const finders = users.filter((u) => u.user_type === "Finder");

  useEffect(() => {
    const userIdParams = localStorage.getItem("userId") ? `?userId=${localStorage.getItem("userId")}` : "";
    fetch(`http://localhost:5000/api/dashboard/stats${userIdParams}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/dashboard/users")
      .then((res) => res.json())
      .then((data) => {
        const userList = data.users || [];
        setUsers(userList);

        const hostCount = userList.filter((u) => u.user_type === "Host").length;
        const finderCount = userList.filter((u) => u.user_type === "Finder").length;

        setStats((prev) => ({
          ...prev,
          hosts: hostCount,
          finders: finderCount,
        }));
      })
      .catch((err) => console.error(err));

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:5000/api/preferences/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.preferences) {
            setMyPreferences(data.preferences.split(",").map(p => p.trim()));
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="dashboard">
      <div className="dash-bg-shape dash-shape-1"></div>
      <div className="dash-bg-shape dash-shape-2"></div>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        <div className="card-row">
          <div className="card" onClick={() => setShowUsers(!showUsers)} style={{ cursor: "pointer" }}>
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

        {/* Users Section */}
        {showUsers && (
          <div className="user-section">
            <h2>Hosts</h2>
            <div className="user-list-grid">
              {hosts.length > 0 ? hosts.map((host, index) => (
                <div key={index} className="user-item-card">
                  <img
                    src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={host.name}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="user-header-flex">
                      <h3>{host.name}</h3>
                      <span className="match-badge-small">
                        {calculateMatchPercentage(myPreferences, host.preferences)}% Match
                      </span>
                    </div>
                    <p>{host.email}</p>
                    <span className="user-city">{host.city || "Not Specified"}</span>
                  </div>
                </div>
              )) : <p className="no-users">No hosts available yet.</p>}
            </div>

            <h2 style={{ marginTop: "50px" }}>Finders</h2>
            <div className="user-list-grid">
              {finders.length > 0 ? finders.map((finder, index) => (
                <div key={index} className="user-item-card">
                  <img
                    src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={finder.name}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="user-header-flex">
                      <h3>{finder.name}</h3>
                      <span className="match-badge-small">
                        {calculateMatchPercentage(myPreferences, finder.preferences)}% Match
                      </span>
                    </div>
                    <p>{finder.email}</p>
                    <span className="user-city">{finder.city || "Not Specified"}</span>
                  </div>
                </div>
              )) : <p className="no-users">No finders available yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
