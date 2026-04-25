import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Chat.css";
import { MessageCircle, Send, MapPin, Users } from "lucide-react";
import { io } from "socket.io-client";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const FREE_LIMIT = 5;

  const messagesBodyRef = useRef(null);
  const socket = useRef(null);
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

    // Initialize Socket Connection
    socket.current = io("http://localhost:5000");

    socket.current.on("receive_message", (message) => {
      // Check if message belongs to current chat
      const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formatted = {
        id: message.id,
        text: message.content,
        sender: String(message.sender_id) === String(userId) ? "me" : "them",
        time
      };
      
      setMessages(prev => {
        // Prevent duplicates if sender is 'me' (since it might be added locally already)
        if (prev.find(msg => msg.id === message.id)) return prev;
        return [...prev, formatted];
      });
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [userId, navigate]);

  // Auto-select contact if navigated from FindRoommates
  useEffect(() => {
    if (contacts.length > 0 && location.state?.selectedUserId && !selectedContact) {
      const contactToSelect = contacts.find(c => c.id === location.state.selectedUserId);
      if (contactToSelect) {
        handleSelectContact(contactToSelect);
      }
    }
  }, [contacts, location.state, selectedContact]);

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
    
    // Join the socket room
    if (socket.current && contact.roomid) {
      socket.current.emit("join_room", { roomid: contact.roomid, userid: userId });
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesBodyRef.current) {
      messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim() || !selectedContact) return;

    if (!isSubscribed) {
      const usedMessages = parseInt(localStorage.getItem(`freeMessages_${userId}`) || "0");
      if (usedMessages >= FREE_LIMIT) {
        setShowLimitModal(true);
        return;
      }
      localStorage.setItem(`freeMessages_${userId}`, usedMessages + 1);
    }

    // Emit via Socket
    if (socket.current && selectedContact.roomid) {
      socket.current.emit("send_message", {
        roomid: selectedContact.roomid,
        senderid: userId,
        receiverid: selectedContact.id,
        content: textToSend
      });
    }

    // Optional: Keep the REST API call if you want 100% redundancy or for simpler message history management
    // But since our socket handler already saves to DB, we don't strictly need it here.
    // However, if we remove it, we should ensure the UI updates via the socket's 'receive_message'.
  };

  const handleSend = () => {
    sendMessage(newMessage);
    setNewMessage(""); 
  };

  const handleSendIcebreaker = (text) => {
    sendMessage(text);
  };

  const handleSend = () => {
    sendMessage(newMessage);
    setNewMessage(""); 
  };

  const handleSendIcebreaker = (text) => {
    sendMessage(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (isLoading) {
    return (
      <div className="chat-page">
        <div className="chat-loading">
          <div className="chat-spinner"></div>
          <p>Loading your inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Subscription Limit Modal */}
      {showLimitModal && (
        <div className="modal-overlay">
          <div className="custom-modal">
            <h3>Free Plan Limit Reached</h3>
            <p>You have used your {FREE_LIMIT} free messages. Subscribe to unlock unlimited high-speed chatting with your future roommates!</p>
            <div className="modal-actions">
              <button className="rm-btn rm-btn-disabled" onClick={() => setShowLimitModal(false)}>Cancel</button>
              <button className="rm-btn rm-btn-chat" onClick={() => navigate("/dashboard/subscription")}>View Plans</button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Backgrounds */}
      <div className="chat-bg-shape chat-shape-1"></div>
      <div className="chat-bg-shape chat-shape-2"></div>

      <div className="chat-container">
        <header className="chat-header">
          <h2 className="chat-title">Messages</h2>
          <p className="chat-subtitle">Connect instantly with your roommate matches</p>
        </header>

        {!Array.isArray(contacts) || contacts.length === 0 ? (
          <div className="no-contacts-card">
            <Users size={72} className="no-chat-icon" />
            <h2>No Connections Yet</h2>
            <p>Once you accept someone's roommate request (or they accept yours), you can start an instant chat right here.</p>
          </div>
        ) : (
          <div className="chat-layout">
            {/* Contacts Sidebar */}
            <div className="chat-contacts">
              <h3 className="contacts-title">Your Connections</h3>
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
                    <p><MapPin size={14} /> {contact?.city || "Anywhere"}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Messages Content */}
            {selectedContact ? (
              <div className="chat-messages">
                <div className="chat-messages-header">
                  <div className="contact-avatar">
                    {selectedContact?.name ? selectedContact.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3>{selectedContact?.name || "Unknown"}</h3>
                    <p>Online</p>
                  </div>
                </div>

                <div className="messages-body" ref={messagesBodyRef}>
                  {Array.isArray(messages) && messages.length === 0 ? (
                    <div className="icebreakers-container">
                      <p className="icebreakers-title">Start the conversation 👋</p>
                      <div className="icebreaker-pills">
                        <button className="icebreaker-pill" onClick={() => handleSendIcebreaker("Hey! Are you still looking for a roommate?")}>
                          Hey! Are you still looking for a roommate?
                        </button>
                        <button className="icebreaker-pill" onClick={() => handleSendIcebreaker("Hi! When are you planning to move?")}>
                          Hi! When are you planning to move?
                        </button>
                        <button className="icebreaker-pill" onClick={() => handleSendIcebreaker("Hey! Just accepted your match!")}>
                          Hey! Just accepted your match!
                        </button>
                      </div>
                    </div>
                  ) : (
                    Array.isArray(messages) && messages.map(msg => (
                      <div key={msg?.id || Math.random()} className={`message-bubble ${msg?.sender === "me" ? "sent" : "received"}`}>
                        {msg?.text}
                        <span className="message-time">{msg?.time}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-input-area">
                  <input
                    type="text"
                    placeholder="Type something amazing..."
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
                <MessageCircle size={80} className="no-chat-icon" />
                <h3>Your Messages Await</h3>
                <p>Select a contact from the sidebar to start your conversation and get to know your future roommate.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
