// import React, { useEffect, useState } from "react";
// import "../../styles/Dashboard.css";
// import { Users, Home, FileText } from "lucide-react";

// function Dashboard() {
//   const [stats, setStats] = useState({
//     users: 0,
//     rooms: 0,
//     requests: 0,
//   });

//   useEffect(() => {
//     fetch("http://localhost:5000/api/dashboard/stats")
//       .then((res) => res.json())
//       .then((data) => setStats(data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1>Dashboard Overview</h1>
//         <p>Your platform summary</p>
//       </div>

//       <div className="card-row">
//         <div className="card">
//           <div className="card-icon users">
//             <Users size={24} />
//           </div>
//           <div>
//             <p>Total Users</p>
//             <h2>{stats.users}</h2>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-icon rooms">
//             <Home size={24} />
//           </div>
//           <div>
//             <p>Total Rooms</p>
//             <h2>{stats.rooms}</h2>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-icon requests">
//             <FileText size={24} />
//           </div>
//           <div>
//             <p>Total Requests</p>
//             <h2>{stats.requests}</h2>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";
import { Users, Home, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../redux/dashboardSlice";

function Dashboard() {

  const dispatch = useDispatch();

  const { stats = { users: 0, rooms: 0, requests: 0 }, loading, error } = useSelector(
    (state) => state.dashboard
  );

  const [hosts, setHosts] = useState([]);
  const [finders, setFinders] = useState([]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    
    // Fetch Hosts and Finders
    fetch("http://localhost:5000/api/dashboard/users")
      .then((res) => res.json())
      .then((data) => {
        setHosts(data.hosts || []);
        setFinders(data.finders || []);
      })
      .catch((err) => console.error("Error fetching users:", err));
      
  }, [dispatch]);

  if (loading) return <p>Loading dashboard...</p>;

  if (error) return <p>{error}</p>;

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
{/* Users Section */}
<div className="user-section">
  <h2>Featured Hosts</h2>

  <div className="user-list-grid">
    {hosts.length > 0 ? hosts.map((host, index) => (
      <div key={index} className="user-item-card">
        <img 
          src={host.profile_image ? `http://localhost:5000${host.profile_image}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
          alt={host.name} 
          className="user-avatar" 
        />
        <div className="user-info">
          <h3>{host.name}</h3>
          <p>{host.email}</p>
          <span className="user-city">{host.city || "Not Specified"}</span>
        </div>
      </div>
    )) : <p className="no-users">No hosts available yet.</p>}
  </div>

  <h2 style={{ marginTop: "50px" }}>Active Finders</h2>

  <div className="user-list-grid">
    {finders.length > 0 ? finders.map((finder, index) => (
      <div key={index} className="user-item-card">
        <img 
          src={finder.profile_image ? `http://localhost:5000${finder.profile_image}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
          alt={finder.name} 
          className="user-avatar" 
        />
        <div className="user-info">
          <h3>{finder.name}</h3>
          <p>{finder.email}</p>
          <span className="user-city">{finder.city || "Not Specified"}</span>
        </div>
      </div>
    )) : <p className="no-users">No finders available yet.</p>}
  </div>
</div>
    </div>);
}

export default Dashboard;
