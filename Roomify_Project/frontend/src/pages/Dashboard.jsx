// function Dashboard() {
//   return (
//     <div>

//       <h1>Dashboard</h1>

//       <div className="stats">

//         <div className="stat-card">Users: 120</div>
//         <div className="stat-card">Rooms: 45</div>
//         <div className="stat-card">Requests: 8</div>

//       </div>

//     </div>
//   );
// }

// export default Dashboard;
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/");
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>Welcome to Dashboard 🎉</h1>
      <h3>Hello, {user?.name}</h3>
    </div>
  );
}

export default Dashboard;
