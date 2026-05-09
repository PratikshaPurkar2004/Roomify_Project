import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, UserPlus, MessageCircle, Check, X, ArrowRight, Trash2, Clock } from "lucide-react";
import "../../styles/Notifications.css";
import { API_URL } from "../../api";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // We'll fetch both requests and a summary of unread messages to build the notifications list
      const [reqRes, chatRes] = await Promise.all([
        fetch(`${API_URL}/api/requests/${userId}`),
        fetch(`${API_URL}/api/subscriptions/contacts/${userId}`)
      ]);

      const reqData = await reqRes.json();
      const chatData = await chatRes.json();

      let combined = [];

      // Add pending requests as notifications
      if (reqData.success) {
        const pending = reqData.requests.filter(r => r.status === "pending").map(r => ({
          id: `req-${r.id}`,
          type: "request",
          originalId: r.id,
          senderName: r.name,
          senderId: r.senderId,
          time: new Date().toISOString(), // Fallback
          message: `sent you a roommate request`,
          data: r
        }));
        combined = [...combined, ...pending];
      }

      // Add contacts with unread messages
      if (chatData.success) {
        const unread = chatData.contacts.filter(c => c.unread_count > 0).map(c => ({
          id: `msg-${c.id}`,
          type: "message",
          senderName: c.name,
          senderId: c.id,
          count: c.unread_count,
          time: new Date().toISOString(),
          message: `sent you ${c.unread_count} new message${c.unread_count > 1 ? 's' : ''}`
        }));
        combined = [...combined, ...unread];
      }

      setNotifications(combined.sort((a, b) => new Date(b.time) - new Date(a.time)));
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (notif) => {
    try {
      const res = await fetch(`${API_URL}/api/requests/${notif.originalId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" })
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
        // Show success and maybe navigate to chat
      }
    } catch (err) {
      console.error("Error accepting:", err);
    }
  };

  const handleDecline = async (notif) => {
    try {
      const res = await fetch(`${API_URL}/api/requests/${notif.originalId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
      }
    } catch (err) {
      console.error("Error declining:", err);
    }
  };

  return (
    <div className="notif-page">
      <div className="notif-bg-blob blob-1"></div>
      <div className="notif-bg-blob blob-2"></div>

      <div className="page-container">
        <header className="notif-header">
          <div className="notif-title-wrap">
            <Bell size={32} className="header-icon" />
            <div>
              <h1>Notifications</h1>
              <p>Stay updated with your roommate matches and messages</p>
            </div>
          </div>
          <button className="refresh-btn" onClick={fetchNotifications}>
            <Clock size={16} /> Refresh
          </button>
        </header>

        <div className="notif-content">
          {isLoading ? (
            <div className="notif-loading">
              <div className="notif-spinner"></div>
              <p>Fetching updates...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-notif-card">
              <div className="empty-icon-circle">
                <Bell size={48} />
              </div>
              <h2>You're all caught up!</h2>
              <p>No new notifications at the moment. We'll alert you when something happens.</p>
              <button className="browse-btn" onClick={() => navigate("/dashboard/find-roommates")}>
                Find Roommates <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="notif-list">
              {notifications.map((notif) => (
                <div key={notif.id} className={`notif-card ${notif.type}`}>
                  <div className="notif-icon-box">
                    {notif.type === "request" ? <UserPlus size={20} /> : <MessageCircle size={20} />}
                  </div>
                  
                  <div className="notif-main">
                    <div className="notif-text">
                      <span className="sender-name">{notif.senderName}</span> {notif.message}
                    </div>
                    {notif.type === "request" && (
                      <div className="notif-actions">
                        <button className="btn-decline" onClick={() => handleDecline(notif)}>
                          <X size={16} /> Decline
                        </button>
                        <button className="btn-accept" onClick={() => handleAccept(notif)}>
                          <Check size={16} /> Accept
                        </button>
                      </div>
                    )}
                    {notif.type === "message" && (
                      <div className="notif-actions">
                        <button className="btn-chat" onClick={() => navigate("/dashboard/chat", { state: { selectedUserId: notif.senderId } })}>
                          Go to Chat <MessageCircle size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="notif-side">
                    <span className="notif-time">Just now</span>
                    <button className="delete-btn" title="Dismiss">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
