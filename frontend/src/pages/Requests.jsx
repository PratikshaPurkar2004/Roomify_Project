// import { useState } from "react";

// export default function Requests() {
//   const [requests, setRequests] = useState([
//     {
//       id: 1,
//       name: "Rahul",
//       status: "Pending",
//     },
//     {
//       id: 2,
//       name: "Neha",
//       status: "Pending",
//     },
//   ]);

//   const handleAccept = (id) => {
//     setRequests(
//       requests.map((r) =>
//         r.id === id ? { ...r, status: "Accepted" } : r
//       )
//     );
//   };

//   const handleReject = (id) => {
//     setRequests(
//       requests.map((r) =>
//         r.id === id ? { ...r, status: "Rejected" } : r
//       )
//     );
//   };

//   return (
//     <div className="requests-page">

//       <h1 className="page-title">Requests</h1>

//       <div className="requests-list">

//         {requests.map((req) => (
//           <div key={req.id} className="request-card">

//             {/* Left */}
//             <div>
//               <h3>{req.name}</h3>
//               <p className={`status ${req.status.toLowerCase()}`}>
//                 {req.status}
//               </p>
//             </div>

//             {/* Right */}
//             <div className="btn-group">

//               {req.status === "Pending" && (
//                 <>
//                   <button
//                     className="btn accept"
//                     onClick={() => handleAccept(req.id)}
//                   >
//                     ✔ Accept
//                   </button>

//                   <button
//                     className="btn reject"
//                     onClick={() => handleReject(req.id)}
//                   >
//                     ✖ Reject
//                   </button>
//                 </>
//               )}

//             </div>

//           </div>
//         ))}

//       </div>

//     </div>
//   );
// }
import { useState } from "react";
import "../styles/Requests.css";

export default function Requests() {

  // Demo requests (later you can connect backend)
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      age: 22,
      area: "Nashik",
      budget: 6500,
      gender: "Male",
    },
    {
      id: 2,
      name: "Neha Patil",
      age: 21,
      area: "Pune",
      budget: 8000,
      gender: "Female",
    },
    {
      id: 3,
      name: "Rahul Verma",
      age: 24,
      area: "Mumbai",
      budget: 9000,
      gender: "Male",
    },
  ]);

  // Accept Request
  const acceptRequest = (id) => {
    alert("Request Accepted ✅");

    setRequests(requests.filter((r) => r.id !== id));
  };

  // Reject Request
  const rejectRequest = (id) => {
    alert("Request Rejected ❌");

    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="requests-page">

      <h1 className="requests-title">Roommate Requests</h1>

      {requests.length === 0 ? (
        <p className="no-requests">
          No new requests 📭
        </p>
      ) : (
        <div className="requests-list">

          {requests.map((req) => (
            <div key={req.id} className="request-card">

              {/* Left Info */}
              <div className="request-info">

                <h3>{req.name}</h3>

                <p>
                  {req.age} yrs | {req.area} | ₹{req.budget} | {req.gender}
                </p>

              </div>

              {/* Buttons */}
              <div className="request-actions">

                <button
                  className="btn accept"
                  onClick={() => acceptRequest(req.id)}
                >
                  Accept
                </button>

                <button
                  className="btn reject"
                  onClick={() => rejectRequest(req.id)}
                >
                  Reject
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
