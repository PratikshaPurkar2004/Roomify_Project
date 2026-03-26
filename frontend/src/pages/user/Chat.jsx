import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Chat.css";
import { MessageCircle, Send, MapPin, Users } from "lucide-react";

export default function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const FREE_LIMIT = 5;

  const userId = localStorage.getItem("userId");

  // Check subscription on mount
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // Check subscription status
    fetch(`http://localhost:5000/api/subscriptions/status/${userId}`)
      .then(res => res.json())
      .then(data => {
        setIsSubscribed(data.subscribed);
        localStorage.setItem("subscribed", data.subscribed ? "true" : "false");
        
        // Fetch accepted contacts regardless of subscription for free limit capability
        return fetch(`http://localhost:5000/api/subscriptions/contacts/${userId}`);
      })
      .then(res => res && res.json())
      .then(data => {
        if (data && data.success) {
          setContacts(Array.isArray(data.contacts) ? data.contacts : []);
        }
      })
      .catch(err => console.error("Error:", err))
      .finally(() => setIsLoading(false));
  }, [userId, navigate]);

  const fetchMessages = async (contactId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/${userId}/${contactId}`);
      const data = await res.json();
      if (data.success) {
        const formatted = data.messages.map(m => {
          const time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            id: m.id,
            text: m.content,
            sender: String(m.sender_id) === String(userId) ? "me" : "them",
            time
          };
        });
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact.id);
  };

  // Poll for messages
  useEffect(() => {
    if (!selectedContact) return;
    const interval = setInterval(() => {
      fetchMessages(selectedContact.id);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedContact, userId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    // Check free message limit if not subscribed
    if (!isSubscribed) {
      const usedMessages = parseInt(localStorage.getItem(`freeMessages_${userId}`) || "0");
      if (usedMessages >= FREE_LIMIT) {
        setShowLimitModal(true);
        return;
      }
      localStorage.setItem(`freeMessages_${userId}`, usedMessages + 1);
    }

    const messageText = newMessage;
    setNewMessage(""); // Clear input early for better UX

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: selectedContact.id,
          content: messageText
        })
      });
      const data = await res.json();
      
      if (data.success) {
        const m = data.message;
        const time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setMessages(prev => [
          ...prev,
          { id: m.id, text: m.content, sender: "me", time }
        ]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (isLoading) {
    return (
      <div className="chat-page">
        <div className="chat-loading">
          <div className="chat-spinner"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Subscription Limit Modal */}
      {showLimitModal && (
        <div className="modal-overlay">
          <div className="custom-modal glass-panel">
            <h3>Free Plan Limit Reached</h3>
            <p>You have used your {FREE_LIMIT} free messages. Subscribe to unlock unlimited chat with your roommates!</p>
            <div className="modal-actions">
              <button className="rm-btn rm-btn-disabled" onClick={() => setShowLimitModal(false)}>Cancel</button>
              <button className="rm-btn rm-btn-chat" onClick={() => navigate("/dashboard/subscription")}>View Plans</button>
            </div>
          </div>
        </div>
      )}

      {/* Background shapes */}
      <div className="chat-bg-shape chat-shape-1"></div>
      <div className="chat-bg-shape chat-shape-2"></div>

      <div className="chat-container">
        <header className="chat-header">
          <h2 className="chat-title">Chat</h2>
          <p className="chat-subtitle">Chat with your accepted roommate matches</p>
        </header>

        {!Array.isArray(contacts) || contacts.length === 0 ? (
          <div className="no-contacts-card">
            <Users size={64} className="no-chat-icon" />
            <h2>No Accepted Matches Yet</h2>
            <p>Once someone accepts your roommate request (or you accept theirs), they'll appear here for chatting.</p>
          </div>
        ) : (
          <div className="chat-layout">
            {/* Contacts List */}
            <div className="chat-contacts">
              <h3 className="contacts-title">Contacts ({contacts.length})</h3>
              {Array.isArray(contacts) && contacts.map(contact => (
                <div
                  key={contact?.id || Math.random()}
                  className={`contact-item ${selectedContact?.id === contact?.id ? 'active' : ''}`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="contact-avatar">
                    {contact?.name ? contact.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="contact-info">
                    <h4>{contact?.name || "Unknown"}</h4>
                    <p><MapPin size={12} /> {contact?.city || "Not specified"}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Messages Area */}
            {selectedContact ? (
              <div className="chat-messages">
                <div className="chat-messages-header">
                  <div className="contact-avatar">
                    {selectedContact?.name ? selectedContact.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3>{selectedContact?.name || "Unknown"}</h3>
                    <p>● Online</p>
                  </div>
                </div>

                <div className="messages-body">
                  {Array.isArray(messages) && messages.map(msg => (
                    <div key={msg?.id || Math.random()} className={`message-bubble ${msg?.sender === "me" ? "sent" : "received"}`}>
                      {msg?.text}
                      <div className="message-time">{msg?.time}</div>
                    </div>
                  ))}
                </div>

                <div className="chat-input-area">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button className="chat-send-btn" onClick={handleSend}>
                    <Send size={18} />
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="select-contact">
                <MessageCircle size={64} className="no-chat-icon" />
                <h3>Select a contact</h3>
                <p>Choose someone from your accepted matches to start chatting</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
