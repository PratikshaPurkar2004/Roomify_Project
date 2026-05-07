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
  const messagesBodyRef = useRef(null);
  const socket = useRef(null);
  const userId = localStorage.getItem("userId");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // Check subscription on mount
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // Fetch accepted contacts
    // Check subscription
    fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/status/${userId}`)
      .then(res => res.json())
      .then(data => setIsSubscribed(data.subscribed))
      .catch(() => setIsSubscribed(false));

    // Check message count
    fetch(`${import.meta.env.VITE_API_URL}/api/chat/eligibility/${userId}`)
      .then(res => res.json())
      .then(data => setMessageCount(data.msgCount || 0))
      .catch(() => setMessageCount(0));

    fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/contacts/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setContacts(Array.isArray(data.contacts) ? data.contacts : []);
        }
      })
      .catch(err => console.error("Error:", err))
      .finally(() => setIsLoading(false));

    // Initialize Socket Connection
    socket.current = io(`${import.meta.env.VITE_API_URL}`);

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

      // If this message is for the currently open chat, mark it as read immediately
      if (selectedContact && String(message.sender_id) === String(selectedContact.id)) {
        markAsRead(message.sender_id);
      } else {
        // Increment unread count for the contact in the sidebar list
        setContacts(prev => prev.map(c => 
          String(c.id) === String(message.sender_id) 
            ? { ...c, unread_count: (c.unread_count || 0) + 1 } 
            : c
        ));
      }
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${userId}/${contactId}`);
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
  const markAsRead = async (contactId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/chat/read/${userId}/${contactId}`, { method: "PUT" });
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact.id);
    markAsRead(contact.id);
    
    // Join the socket room
    if (socket.current && contact.roomid) {
      socket.current.emit("join_room", { roomid: contact.roomid, userid: userId });
    }

    // Clear unread count locally for this contact
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, unread_count: 0 } : c));
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesBodyRef.current) {
      messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim() || !selectedContact) return;
    
    // Check limit
    if (!isSubscribed && messageCount >= 5) {
      navigate("/dashboard/subscription");
      return;
    }

    // Socket logic here...

    // Emit via Socket
    if (socket.current && selectedContact.roomid) {
      const tempId = Date.now();
      const formatted = {
        id: tempId,
        text: textToSend,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, formatted]);
      setNewMessage(""); // Clear input immediately

      socket.current.emit("send_message", {
        roomid: selectedContact.roomid,
        senderid: userId,
        receiverid: selectedContact.id,
        content: textToSend
      });
      
      // Increment count locally
      if (!isSubscribed) setMessageCount(prev => prev + 1);
    }
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
      {/* Dynamic Backgrounds */}
      <div className="chat-bg-shape chat-shape-1"></div>
      <div className="chat-bg-shape chat-shape-2"></div>

      <div className="page-container">
        <div className="chat-container">

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4>{contact?.name || "Unknown"}</h4>
                      {contact?.unread_count > 0 && <span className="sidebar-badge" style={{ position: 'static' }}>{contact.unread_count}</span>}
                    </div>
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
    </div>

  );
}
