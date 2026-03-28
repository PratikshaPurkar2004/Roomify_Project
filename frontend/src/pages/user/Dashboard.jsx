import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { Users, Home, FileText, UserPlus, UserSearch, Plus, MapPin, DollarSign, X, TrendingUp, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateMatchPercentage } from "../../utils/matchUtils";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    requests: 0,
    hosts: 0,
    finders: 0,
    views: 0,
  });

  const [users, setUsers] = useState([]);
  const [myPreferences, setMyPreferences] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [showViewRoomModal, setShowViewRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({ location: "", rent: "", image: null });
  const [editRoom, setEditRoom] = useState({ location: "", rent: "", availability: "", image: null });

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const isHost = currentUser.user_type === "Host";

  const hosts = users.filter((u) => u.user_type === "Host");
  const finders = users.filter((u) => u.user_type === "Finder");

  const phrases = [
    "Defining the future of co-living and shared spaces.",
    "Connecting modern professionals with premium living experiences.",
    "Your bridge to comfortable, convenient, and collaborative living.",
    "Simplifying the journey to your next perfect home.",
    "Where professional networks find personal comfort."
  ];
  const [randomPhrase] = useState(phrases[Math.floor(Math.random() * phrases.length)]);

  const chartData = [
    { name: 'Mon', views: Math.floor((stats.views || 10) * 0.4), matches: Math.floor((stats.views || 5) * 0.2) },
    { name: 'Tue', views: Math.floor((stats.views || 15) * 0.6), matches: Math.floor((stats.views || 8) * 0.3) },
    { name: 'Wed', views: Math.floor((stats.views || 25) * 0.8), matches: Math.floor((stats.views || 12) * 0.5) },
    { name: 'Thu', views: Math.floor((stats.views || 20) * 0.7), matches: Math.floor((stats.views || 10) * 0.4) },
    { name: 'Fri', views: Math.floor((stats.views || 30) * 0.9), matches: Math.floor((stats.views || 18) * 0.6) },
    { name: 'Sat', views: (stats.views || 42), matches: Math.floor((stats.views || 24) * 0.7) },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const userIdParams = localStorage.getItem("userId") ? `?userId=${localStorage.getItem("userId")}` : "";
    fetch(`http://localhost:5000/api/dashboard/stats${userIdParams}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error("Stats fetch error:", err));

    fetch("http://localhost:5000/api/dashboard/users")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Check if data has users property (success) or is an error object
        const userList = (data && Array.isArray(data.users)) ? data.users : [];
        setUsers(userList);

        const hostCount = userList.filter((u) => u.user_type === "Host").length;
        const finderCount = userList.filter((u) => u.user_type === "Finder").length;

        setStats((prev) => ({
          ...prev,
          hosts: hostCount,
          finders: finderCount,
        }));
      })
      .catch((err) => {
        console.error("Users fetch error:", err);
        setUsers([]);
      });

    if (userId) {
      fetch(`http://localhost:5000/api/preferences/${userId}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data && data.preferences) {
            setMyPreferences(data.preferences.split(",").map(p => p.trim()));
          }
        })
        .catch(err => console.error("Preferences fetch error:", err));

      if (isHost) {
        fetch(`http://localhost:5000/api/rooms/host/${userId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setMyRooms(data.rooms);
            }
          })
          .catch(err => console.error("Rooms fetch error:", err));
      }
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
