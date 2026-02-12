import { useState } from "react";

export default function Requests() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Rahul",
      status: "Pending",
    },
    {
      id: 2,
      name: "Neha",
      status: "Pending",
    },
  ]);

  const handleAccept = (id) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: "Accepted" } : r
      )
    );
  };

  const handleReject = (id) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: "Rejected" } : r
      )
    );
  };

  return (
    <div className="requests-page">

      <h1 className="page-title">Requests</h1>

      <div className="requests-list">

        {requests.map((req) => (
          <div key={req.id} className="request-card">

            {/* Left */}
            <div>
              <h3>{req.name}</h3>
              <p className={`status ${req.status.toLowerCase()}`}>
                {req.status}
              </p>
            </div>

            {/* Right */}
            <div className="btn-group">

              {req.status === "Pending" && (
                <>
                  <button
                    className="btn accept"
                    onClick={() => handleAccept(req.id)}
                  >
                    ✔ Accept
                  </button>

                  <button
                    className="btn reject"
                    onClick={() => handleReject(req.id)}
                  >
                    ✖ Reject
                  </button>
                </>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
