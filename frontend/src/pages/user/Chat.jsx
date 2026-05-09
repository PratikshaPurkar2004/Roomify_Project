import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Chat.css";
import { MessageCircle, Send, Search, User, CheckCheck, Trash2, AlertTriangle } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_URL } from "../../api";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const messagesBodyRef = useRef(null);
  const socket = useRef(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setTimeout(() => {
      if (messagesBodyRef.current) {
        messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
      }
    }, 50);
  }, [messages]);

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    const fetchData = async () => {
      try {
        const [eligRes, contactsRes, subRes] = await Promise.all([
          fetch(`${API_URL}/api/chat/eligibility/${userId}`),
          fetch(`${API_URL}/api/subscriptions/contacts/${userId}`),
          fetch(`${API_URL}/api/subscriptions/status/${userId}`)
        ]);
        const eligData = await eligRes.json();
        setMessageCount(eligData.msgCount || 0);
        const subData = await subRes.json();
        setIsSubscribed(subData.subscribed || false);
        const contactsData = await contactsRes.json();
        if (contactsData?.success) {
          const formatted = contactsData.contacts.map(c => ({
             ...c, 
             roomid: c.roomid || [parseInt(userId), parseInt(c.id)].sort((a,b)=>a-b).join('_'),
             last_message: c.last_message || "Start chatting...",
             last_message_time: c.last_message_time || null
          }));
          setContacts(formatted);
        }
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchData();
    socket.current = io(`${API_URL}`);
    socket.current.emit("join_room", { userid: userId }); // Join personal global room
    
    socket.current.on("receive_message", (message) => {
      const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formatted = { id: message.id, text: message.content, sender: String(message.sender_id) === String(userId) ? "me" : "them", time };
      
      if (selectedContact && (String(message.sender_id) === String(selectedContact.id) || String(message.sender_id) === String(userId))) {
        setMessages(prev => prev.find(m => m.id === message.id) ? prev : [...prev, formatted]);
      }

      setContacts(prev => {
        const newContacts = prev.map(c => {
          const isSender = Number(c.id) === Number(message.sender_id);
          const isReceiver = Number(c.id) === Number(message.receiver_id);
          
          if (isSender) {
            const isCurrentlySelected = selectedContact && Number(selectedContact.id) === Number(c.id);
            return { 
              ...c, 
              last_message: message.content, 
              last_message_time: message.created_at,
              unread_count: isCurrentlySelected ? 0 : (Number(c.unread_count) || 0) + 1 
            };
          }
          if (isReceiver) {
             return { ...c, last_message: message.content, last_message_time: message.created_at };
          }
          return c;
        });
        return [...newContacts].sort((a, b) => new Date(b.last_message_time || 0) - new Date(a.last_message_time || 0));
      });

      if (selectedContact && Number(message.sender_id) === Number(selectedContact.id)) { markAsRead(message.sender_id); }
    });
    return () => { if (socket.current) socket.current.disconnect(); };
  }, [userId, navigate, selectedContact]);

  useEffect(() => {
    if (contacts.length > 0 && location.state?.selectedUserId && !selectedContact) {
      const c = contacts.find(c => c.id === location.state.selectedUserId);
      if (c) handleSelectContact(c);
    }
  }, [contacts, location.state, selectedContact]);

  const fetchMessages = async (cid) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/${userId}/${cid}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages.map(m => ({
          id: m.id, text: m.content, sender: String(m.sender_id) === String(userId) ? "me" : "them",
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      }
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (cid) => {
    try { await fetch(`${API_URL}/api/chat/read/${userId}/${cid}`, { method: "PUT" }); } catch (err) { console.error(err); }
  };

  const handleSelectContact = (c) => {
    setSelectedContact(c);
    fetchMessages(c.id);
    markAsRead(c.id);
    if (socket.current && c.roomid) socket.current.emit("join_room", { roomid: c.roomid, userid: userId });
    setContacts(prev => prev.map(i => i.id === c.id ? { ...i, unread_count: 0 } : i));
  };

  const sendMessage = async (txt) => {
    if (!txt.trim() || !selectedContact) return;
    if (!isSubscribed && messageCount >= 5) { setShowPaymentModal(true); return; }
    if (socket.current && selectedContact.roomid) {
      const tempId = Date.now();
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { id: tempId, text: txt, sender: "me", time }]);
      setNewMessage("");
      socket.current.emit("send_message", { roomid: selectedContact.roomid, sender_id: userId, receiver_id: selectedContact.id, content: txt });
      if (!isSubscribed) setMessageCount(prev => prev + 1);
    }
  };

  const handleConfirmPayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/subscriptions/subscribe`, { user_id: userId, plan_name: 'Roomify Pro', amount: 499, payment_method: 'UPI' });
      if (res.data.success) { setIsSubscribed(true); setShowPaymentModal(false); }
    } catch (err) { console.error(err); }
    setPaymentLoading(false);
  };

  const handleClearChat = () => {
    if (!selectedContact) return;
    setShowClearModal(true);
  };

  const confirmClearChat = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/clear/${userId}/${selectedContact.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessages([]);
        setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, last_message: "Start chatting...", last_message_time: null } : c));
      }
    } catch (err) { console.error("Clear chat error:", err); }
    setShowClearModal(false);
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) return <div className="chat-page-loader">Loading...</div>;

  return (
    <div className="chat-page-content">
      <div className="chat-layout">
        <div className="chat-contacts-card">
          <div className="chat-sidebar-header">
             <h2 className="sidebar-main-title">Chats</h2>
             <div className="chat-search-bar-modern">
               <Search size={18} className="search-icon-dim" />
               <input type="text" placeholder="Search conversations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
          </div>
          <div className="contacts-list-scrollable">
            {filteredContacts.map(c => (
              <div key={c.id} className={`contact-card-item ${selectedContact?.id === c.id ? 'active' : ''}`} onClick={() => handleSelectContact(c)}>
                <div className="contact-avatar-square">{c.name.charAt(0).toUpperCase()}</div>
                <div className="contact-details-box">
                  <div className="contact-name-row">
                    <h4>{c.name}</h4>
                    {c.last_message_time && (
                      <span className={`timestamp-small ${c.unread_count > 0 ? 'unread-time-wp' : ''}`}>
                        {new Date(c.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="contact-status-row">
                    <p className={`preview-text-faint ${Number(c.unread_count) > 0 ? 'unread-bold' : ''}`}>{c.last_message}</p>
                    {Number(c.unread_count) > 0 && <span className="unread-dot-badge-wp">{c.unread_count}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedContact ? (
          <div className="chat-messages-card">
            <div className="messages-header-modern">
              <div className="header-user-info">
                 <div className="contact-avatar-square small">{selectedContact.name.charAt(0).toUpperCase()}</div>
                 <div className="name-status-box">
                   <h3>{selectedContact.name}</h3>
                   <div className="active-now-status">
                      <div className="green-dot"></div>
                      <span>Active now</span>
                   </div>
                 </div>
              </div>
              <div className="header-actions-group">
                <button className="clear-chat-trash-btn" title="Clear Chat" onClick={handleClearChat}>
                  <Trash2 size={20} />
                </button>
                <button className="view-profile-pill-btn" onClick={() => navigate(`/dashboard/roommate/${selectedContact.id}`)}>View Profile</button>
              </div>
            </div>
            <div className="messages-body-viewport" ref={messagesBodyRef}>
              {messages.map(m => (
                <div key={m.id} className={`message-bubble-modern ${m.sender === "me" ? "sent" : "received"}`}>
                  <span className="msg-content-text">{m.text}</span>
                  <div className="msg-metadata">
                    <span className="msg-time-small">{m.time}</span>
                    {m.sender === "me" && <CheckCheck size={14} className="check-icon-blue" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input-footer-area">
              <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage(newMessage)} />
              <button className="send-circle-btn" onClick={() => sendMessage(newMessage)}><Send size={20} /></button>
            </div>
          </div>
        ) : (
          <div className="chat-messages-card empty-state">
             <MessageCircle size={100} color="#6366f1" style={{opacity: 0.1, marginBottom: 20}} />
             <h3>Your Messages</h3>
             <p>Select a conversation from the sidebar to start chatting.</p>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-card">
            <button className="modal-close-unique" onClick={() => setShowPaymentModal(false)}>×</button>
            <div className="modal-step-content">
              <div style={{fontSize: 50, marginBottom: 25}}>💎</div>
              <h2 style={{fontSize: 32, fontWeight: 800, marginBottom: 15}}>Upgrade Your Chat</h2>
              <p style={{color: '#64748b', fontSize: 16, marginBottom: 35}}>You've reached the free message limit (5 messages). Unlock unlimited conversations with Roomify Pro.</p>
              <button className="modal-action-btn" disabled={paymentLoading} onClick={handleConfirmPayment}>
                {paymentLoading ? "Processing..." : "Upgrade to Pro @ ₹499"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-card" style={{maxWidth: 420}}>
            <button className="modal-close-unique" onClick={() => setShowClearModal(false)}>×</button>
            <div className="modal-step-content">
              <div style={{width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
                <Trash2 size={30} color="#EF4444" />
              </div>
              <h2 style={{fontSize: 24, fontWeight: 800, marginBottom: 10, color: '#0f172a'}}>Clear Chat</h2>
              <p style={{color: '#64748b', fontSize: 15, marginBottom: 30, lineHeight: 1.6}}>Are you sure you want to clear your chat with <strong>{selectedContact?.name}</strong>? This action cannot be undone.</p>
              <div style={{display: 'flex', gap: 12}}>
                <button onClick={() => setShowClearModal(false)} style={{flex: 1, padding: '14px 20px', borderRadius: 16, border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s'}}>
                  Cancel
                </button>
                <button onClick={confirmClearChat} style={{flex: 1, padding: '14px 20px', borderRadius: 16, border: 'none', background: '#EF4444', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 8px 20px rgba(239,68,68,0.3)', transition: 'all 0.2s'}}>
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
