import { useState, useEffect } from "react";
import "../../styles/Requests.css";
import { User, MapPin, Wallet, CheckCircle, XCircle, Inbox, UserCheck, UserX } from "lucide-react";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/requests/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const pending = data.requests.filter(r => r.status === "pending");
          setRequests(pending);
        }
      })
      .catch(err => console.error("Error fetching requests:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Request ${status} successfully! ✅`);
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        setToastMessage("Failed to update status.");
      }
    } catch (err) {
      setToastMessage("Error updating request.");
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  const acceptRequest = (id) => updateStatus(id, "accepted");
  const rejectRequest = (id) => updateStatus(id, "rejected");

  return (
    <div className="requests-page">
      {/* Dynamic Background Elements */}
      <div className="req-bg-shape req-shape-1"></div>
      <div className="req-bg-shape req-shape-2"></div>
      
      {toastMessage && (
        <div className="custom-toast glass-toast">
          {toastMessage.includes('successfully') ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="requests-container">
        <header className="requests-header">
          <h1 className="requests-title">Roommate Requests</h1>
          <p className="requests-subtitle">Manage your incoming roommate requests and find your perfect match.</p>
        </header>

        {isLoading ? (
          <div className="requests-loading">
            <div className="req-spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="no-requests-card">
             <Inbox size={64} className="no-req-icon" />
             <h2>No Pending Requests</h2>
             <p>You're all caught up! Check back later for new roommate requests.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map((req) => (
              <div key={req.id} className="request-card-modern">
                <div className="req-card-header">
                  <div className="req-avatar">
                    {req.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="req-user-info">
                    <h3>{req.name}</h3>
                    <span className="req-badge">Needs a Roommate</span>
                  </div>
                </div>

                <div className="req-card-body">
                  <div className="req-detail">
                    <MapPin size={18} className="req-icon location-icon" />
                    <span>{req.city || "Not Specified"}</span>
                  </div>
                  <div className="req-detail">
                    <Wallet size={18} className="req-icon budget-icon" />
                    <span>₹{req.budget || "N/A"}</span>
                  </div>
                  <div className="req-detail">
                    <User size={18} className="req-icon gender-icon" />
                    <span>{req.gender || "Any"}</span>
                  </div>
                </div>

                <div className="req-card-actions">
                  <button
                    className="req-btn req-btn-reject"
                    onClick={() => rejectRequest(req.id)}
                  >
                    <UserX size={18} />
                    <span>Decline</span>
                  </button>
                  <button
                    className="req-btn req-btn-accept"
                    onClick={() => acceptRequest(req.id)}
                  >
                    <UserCheck size={18} />
                    <span>Accept Match</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
