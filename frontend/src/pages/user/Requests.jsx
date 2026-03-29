import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Requests.css";
import { User, MapPin, Wallet, CheckCircle, XCircle, Inbox, UserCheck, UserX, MessageCircle, Send } from "lucide-react";

export default function Requests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("incoming"); // 'incoming' or 'sent'
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Fetch incoming
    fetch(`http://localhost:5000/api/requests/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const pending = data.requests.filter(r => r.status === "pending");
          setRequests(pending);
        }
      })
      .catch(err => console.error("Error fetching incoming:", err));

    // Fetch sent
    fetch(`http://localhost:5000/api/requests/sent-details/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSentRequests(data.requests);
        }
      })
      .catch(err => console.error("Error fetching sent:", err))
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
        if (status === "rejected") {
          setRequests(prev => prev.filter(r => r.id !== id));
        } else {
          setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "accepted" } : r));
        }
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

  const displayList = activeTab === "incoming" ? requests : sentRequests;

  return (
    <div className="requests-page">
      <div className="req-bg-shape req-shape-1"></div>
      <div className="req-bg-shape req-shape-2"></div>
      
      {toastMessage && (
        <div className="custom-toast glass-toast">
          {toastMessage.includes('successfully') ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="requests-container">
        <header className="requests-header" style={{ marginBottom: '20px' }}>
          <h1 className="requests-title">Roommate Requests</h1>
          <p className="requests-subtitle">Manage your incoming requests and track the ones you've sent.</p>
        </header>

        {/* Custom Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '30px' }}>
          <button 
            onClick={() => setActiveTab("incoming")}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'incoming' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.7)',
              color: activeTab === 'incoming' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: activeTab === 'incoming' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
              fontFamily: 'Outfit'
            }}
          >
            <Inbox size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }}/>
            Incoming Requests
          </button>
          <button 
            onClick={() => setActiveTab("sent")}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'sent' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.7)',
              color: activeTab === 'sent' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: activeTab === 'sent' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
              fontFamily: 'Outfit'
            }}
          >
            <Send size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }}/>
            Sent Requests
          </button>
        </div>

        {isLoading ? (
          <div className="requests-loading">
            <div className="req-spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="no-requests-card">
             <Inbox size={64} className="no-req-icon" />
             <h2>No {activeTab === "incoming" ? "Pending" : "Sent"} Requests</h2>
             <p>{activeTab === "incoming" 
               ? "You're all caught up! Check back later for new roommate requests."
               : "You haven't sent any roommate requests yet. Go to Find Roommates to connect with people!"}</p>
          </div>
        ) : (
          <div className="requests-grid">
            {displayList.map((req) => (
              <div key={req.id || req.request_id} className="request-card-modern">
                <div className="req-card-header">
                  <div className="req-avatar">
                    {req.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="req-user-info">
                    <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '400', color: '#64748b', fontSize: '14px' }}>
                        {activeTab === "incoming" ? "Request from: " : "Sent to: "}
                      </span>
                      <br/>{req.name}
                    </h3>
                    {activeTab === "incoming" ? (
                      <span className="req-badge" style={{ background: req.status === 'accepted' ? '#10b981' : '#f1f5f9', color: req.status === 'accepted' ? 'white' : '#475569' }}>
                        {req.status === 'accepted' ? 'Match Accepted 🎉' : 'Needs a Roommate'}
                      </span>
                    ) : (
                      <span className="req-badge" style={{ 
                        background: req.status === 'accepted' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
                        color: 'white'
                      }}>
                        Status: {req.status}
                      </span>
                    )}
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
                  {activeTab === "incoming" ? (
                    req.status === 'accepted' ? (
                      <button
                        className="req-btn req-btn-accept"
                        onClick={() => navigate("/dashboard/chat", { state: { selectedUserId: req.senderId } })}
                        style={{ width: '100%' }}
                      >
                        <MessageCircle size={18} />
                        <span>Chat with {req.name}</span>
                      </button>
                    ) : (
                      <>
                        <button className="req-btn req-btn-reject" onClick={() => rejectRequest(req.id)}>
                          <UserX size={18} /><span>Decline</span>
                        </button>
                        <button className="req-btn req-btn-accept" onClick={() => acceptRequest(req.id)}>
                          <UserCheck size={18} /><span>Accept Request</span>
                        </button>
                      </>
                    )
                  ) : (
                    <button
                      className="req-btn"
                      style={{ width: '100%', background: req.status === 'accepted' ? 'linear-gradient(135deg, #0ea5e9, #3b82f6)' : '#f1f5f9', color: req.status === 'accepted' ? 'white' : '#94a3b8', cursor: req.status === 'accepted' ? 'pointer' : 'not-allowed' }}
                      onClick={() => req.status === 'accepted' && navigate("/dashboard/chat", { state: { selectedUserId: req.peer_id } })}
                      disabled={req.status !== 'accepted'}
                    >
                      {req.status === 'accepted' ? <><MessageCircle size={18} /><span>Chat with {req.name}</span></> : <span>Waiting for approval</span>}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
