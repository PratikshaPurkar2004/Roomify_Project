// // import React from "react";
// // import { Routes, Route, Navigate } from "react-router-dom";

// // import Welcome from "../Component/Welcome";
// // import Login from "../Component/Login";
// // import Forgot from "../Component/Forgot";
// // import Registration from "../Component/Registration";

// // function Routing() {
// //   return (
// //     <Routes>
// //       <Route path="/" element={<Welcome />} />
// //       <Route path="/login" element={<Login />} />
// //       <Route path="/forgot-password" element={<Forgot />} />
// //       <Route path="/signup" element={<Registration />} />

// //       <Route path="*" element={<Navigate to="/" />} />
// //     </Routes>
// //   );
// // }

// // export default Routing;

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Welcome from "../Component/Welcome";
// import Login from "../Component/Login";
// import Forgot from "../Component/Forgot";
// import Registration from "../Component/Registration";

// import Header from "../Component/Header";
// import Sidebar from "../Component/Sidebar";
// import Footer from "../Component/Footer";

// import Dashboard from "../pages/Dashboard";
// import Profile from "../pages/Profile";
// import FindRoommates from "../pages/FindRoommates";
// import Requests from "../pages/Requests";
// import Subscription from "../pages/Subscription";

// function Routing() {
//   return (
//     <Routes>
//       {/* Public Pages */}
//       <Route path="/" element={<Welcome />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Registration />} />
//       <Route path="/forgot-password" element={<Forgot />} />

//       {/* Dashboard Layout */}
//       <Route
//         path="/dashboard/*"
//         element={
//           <>
//             <Header />

//             <div className="layout">
//               <Sidebar />

//               <div className="content">
//                 <Routes>
//                   <Route index element={<Dashboard />} />
//                   <Route path="profile" element={<Profile />} />
//                   <Route path="find-roommates" element={<FindRoommates />} />
//                   <Route path="requests" element={<Requests />} />
//                   <Route path="subscription" element={<Subscription />} />
//                 </Routes>
//               </div>
//             </div>

//             <Footer />
//           </>
//         }
//       />

//       {/* Redirect */}
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// }

// export default Routing;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "../Component/Welcome";
import Login from "../Component/Login";
import ForgotPassword from "../Component/ForgotPassword";
import ResetPassword from "../Component/ResetPassword";
import Registration from "../Component/Registration";

import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import Footer from "../Component/Footer";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Requests from "../pages/Requests";

function Routing() {
  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/signup" element={<Registration />} />

      {/* Dashboard Layout */}
      <Route
        path="/dashboard/*"
        element={
          <>
            <Header />

            <div className="layout">
              <Sidebar />

              <div className="content">
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="requests" element={<Requests />} />
                </Routes>
              </div>
            </div>

            <Footer />
          </>
        }
      />

      {/* Redirect unknown */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default Routing;