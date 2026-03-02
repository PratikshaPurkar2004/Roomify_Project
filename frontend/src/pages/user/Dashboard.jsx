// import React, { useEffect, useState } from "react";
// import "../styles/Dashboard.css";

// function Dashboard() {

//   // Store data from backend
//   const [stats, setStats] = useState({
//     users: 0,
//     rooms: 0,
//     requests: 0,
//   });

//   // Fetch data when page loads
//   useEffect(() => {
//     fetch("http://localhost:5000/api/dashboard/stats")
//       .then((res) => res.json())
//       .then((data) => {
//         setStats(data); // save backend data
//       })
//       .catch((err) => {
//         console.error("Error fetching dashboard data:", err);
//       });
//   }, []);

//   return (
//     <div className="dashboard">

//       <h1>Dashboard</h1>

//       <div className="card-row">

//         <div className="card">
//           <p>Users</p>
//           <h2>{stats.users}</h2>
//         </div>

//         <div className="card">
//           <p>Rooms</p>
//           <h2>{stats.rooms}</h2>
//         </div>

//         <div className="card">
//           <p>Requests</p>
//           <h2>{stats.requests}</h2>
//         </div>

//       </div>

//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
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
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      });
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back 👋 Here’s your platform summary</p>
      </div>

      <div className="card-row">

        <div className="card">
          <div className="card-icon users">
            <Users size={28} />
          </div>
          <div>
            <p>Total Users</p>
            <h2>{stats.users}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon rooms">
            <Home size={28} />
          </div>
          <div>
            <p>Total Rooms</p>
            <h2>{stats.rooms}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon requests">
            <FileText size={28} />
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