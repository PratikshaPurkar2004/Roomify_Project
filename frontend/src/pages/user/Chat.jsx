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
  const [messageCount, setMessageCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentStep, setPaymentStep] = useState('method'); // 'method' or 'details'
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
    fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/status/${userId}`)
      .then(res => res.json())
      .then(data => {
        setIsSubscribed(data.subscribed);
        // Fetch message count eligibility
        fetch(`${import.meta.env.VITE_API_URL}/api/chat/eligibility/${userId}`)
          .then(res => res.json())
          .then(eligData => {
            console.log("Chat Eligibility Data:", eligData);
            if (eligData.success) {
              setMessageCount(Number(eligData.msgCount) || 0);
            }
          });

        // Fetch accepted contacts regardless of subscription for free limit capability
        return fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/contacts/${userId}`);
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

    console.log(`Checking limit: Subscribed=${isSubscribed}, Count=${messageCount}, Limit=${FREE_LIMIT}`);

    if (!isSubscribed && messageCount >= FREE_LIMIT) {
      console.log("Limit reached! Showing modal.");
      setShowLimitModal(true);
      return;
    }

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
      
      // Increment locally for trial tracking
      setMessageCount(prev => prev + 1);
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

  const handleConfirmPayment = async (method) => {
    if (!userId || !selectedPlan) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: userId, 
          plan_name: selectedPlan.name, 
          amount: selectedPlan.amount,
          payment_method: method 
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        localStorage.setItem("subscribed", "true");
        setShowLimitModal(false);
        setShowPaymentOptions(false);
        // Refresh contacts to ensure UI updates
        fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/contacts/${userId}`)
          .then(r => r.json())
          .then(d => { if (d.success) setContacts(d.contacts); });
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
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
          <div className="custom-modal" style={{ maxWidth: showPaymentOptions ? '450px' : '750px', width: '90%' }}>
            <button className="close-plan-btn" onClick={() => { setShowLimitModal(false); setShowPaymentOptions(false); setSelectedPlan(null); }} style={{ position:'absolute', top:20, right:20, background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
            
            {!showPaymentOptions ? (
              <>
                <div className="limit-icon-wrap" style={{ background:'#f5f3ff', width:60, height:60, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                  <Users size={30} color="#6366f1" />
                </div>
                <h3 style={{ fontSize:26, fontWeight:800, color:'#1e293b', marginBottom:10 }}>Choose Your Plan</h3>
                <p style={{ color:'#64748b', lineHeight:1.6, fontSize:15, marginBottom:30 }}>Upgrade to Pro for more features and verified roommates.</p>
                
                <div className="sub-grid" style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap' }}>
                  {/* Basic Plan */}
                  <div className="sub-card" style={{ width:280, textAlign:'center', padding:30, borderRadius:20, border:'1px solid #e2e8f0', background:'white' }}>
                    <h4 style={{ fontSize:16, color:'#64748b', margin:'0 0 10px' }}>Basic</h4>
                    <div style={{ fontSize:36, fontWeight:800, color:'#1e293b', margin:'0 0 20px' }}>Free</div>
                    <ul style={{ listStyle:'none', padding:0, margin:'0 0 25px', textAlign:'left', fontSize:13, color:'#475569' }}>
                      <li style={{ marginBottom:8 }}>✓ Browse Rooms</li>
                      <li style={{ marginBottom:8 }}>✓ Limited Contact</li>
                      <li>✓ Standard Support</li>
                    </ul>
                    <button className="rm-btn rm-btn-chat" style={{ width:'100%', fontSize:14, background:'#f1f5f9', color:'#475569', boxShadow:'none' }} onClick={() => setShowLimitModal(false)}>Select Basic</button>
                  </div>

                  {/* Pro Plan */}
                  <div className="sub-card popular" style={{ width:280, textAlign:'center', padding:30, borderRadius:20, border:'2px solid #6366f1', background:'linear-gradient(180deg, #ffffff, #f5f3ff)', position:'relative' }}>
                    <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#6366f1', color:'white', fontSize:10, padding:'4px 12px', borderRadius:20, fontWeight:800 }}>MOST POPULAR</div>
                    <h4 style={{ fontSize:16, color:'#64748b', margin:'0 0 10px' }}>Roomify Pro</h4>
                    <div style={{ fontSize:36, fontWeight:800, color:'#6366F1', margin:'0 0 20px' }}>₹499<span style={{ fontSize:14, color:'#94a3b8' }}>/mo</span></div>
                    <ul style={{ listStyle:'none', padding:0, margin:'0 0 25px', textAlign:'left', fontSize:13, color:'#475569' }}>
                      <li style={{ marginBottom:8 }}>✓ Unlimited Chats</li>
                      <li style={{ marginBottom:8 }}>✓ Verified Badge ✓</li>
                      <li style={{ marginBottom:8 }}>✓ Priority Listing</li>
                      <li>✓ AI Smart Matches</li>
                    </ul>
                    <button className="rm-btn rm-btn-chat" onClick={() => { setSelectedPlan({name:'Roomify Pro', amount:499}); setShowPaymentOptions(true); }} style={{ width:'100%', fontSize:14 }}>Get Pro</button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign:'left' }}>
                <button onClick={() => setShowPaymentOptions(false)} style={{ background:'none', border:'none', color:'#6366f1', fontWeight:700, cursor:'pointer', marginBottom:15, padding:0 }}>← Change Plan</button>
                <h3 style={{ fontSize:22, fontWeight:800, color:'#1e293b', marginBottom:8 }}>Checkout</h3>
                <p style={{ color:'#64748b', marginBottom:25 }}>Subscribe to <strong>{selectedPlan.name}</strong> for <strong>₹{selectedPlan.amount}</strong></p>
                
                {paymentStep === 'method' ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    <div className="payment-option" onClick={() => { setPaymentMethod('UPI'); setPaymentStep('details'); }} style={{ display:'flex', alignItems:'center', gap:15, padding:16, border:'1.5px solid #e2e8f0', borderRadius:16, cursor:'pointer', background:'#fff', transition:'0.2s' }}>
                      <span style={{ fontSize:24 }}>📲</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color:'#334155' }}>UPI (PhonePe, GPay)</div>
                        <div style={{ fontSize:11, color:'#94a3b8' }}>Secure instant transfer</div>
                      </div>
                    </div>
                    <div className="payment-option" onClick={() => { setPaymentMethod('Card'); setPaymentStep('details'); }} style={{ display:'flex', alignItems:'center', gap:15, padding:16, border:'1.5px solid #e2e8f0', borderRadius:16, cursor:'pointer', background:'#fff', transition:'0.2s' }}>
                      <span style={{ fontSize:24 }}>💳</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color:'#334155' }}>Credit / Debit Card</div>
                        <div style={{ fontSize:11, color:'#94a3b8' }}>Visa, Mastercard, RuPay</div>
                      </div>
                    </div>
                    <div className="payment-option" onClick={() => { setPaymentMethod('NetBanking'); setPaymentStep('details'); }} style={{ display:'flex', alignItems:'center', gap:15, padding:16, border:'1.5px solid #e2e8f0', borderRadius:16, cursor:'pointer', background:'#fff', transition:'0.2s' }}>
                      <span style={{ fontSize:24 }}>🏦</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color:'#334155' }}>Net Banking</div>
                        <div style={{ fontSize:11, color:'#94a3b8' }}>All major Indian banks</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="payment-details-form">
                    <button onClick={() => setPaymentStep('method')} style={{ background:'none', border:'none', color:'#6366f1', fontSize:12, fontWeight:700, cursor:'pointer', marginBottom:15, padding:0 }}>← Back to methods</button>
                    
                    {paymentMethod === 'UPI' && (
                      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                        <input type="text" placeholder="Enter UPI ID (e.g. user@okaxis)" style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #e2e8f0' }} />
                        <button className="rm-btn rm-btn-chat" onClick={() => handleConfirmPayment("UPI")} style={{ width:'100%' }}>Verify & Pay ₹{selectedPlan.amount}</button>
                      </div>
                    )}

                    {paymentMethod === 'Card' && (
                      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                        <input type="text" placeholder="Card Number" style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #e2e8f0' }} />
                        <div style={{ display:'flex', gap:10 }}>
                          <input type="text" placeholder="MM/YY" style={{ flex:1, padding:12, borderRadius:10, border:'1px solid #e2e8f0' }} />
                          <input type="password" placeholder="CVV" style={{ flex:1, padding:12, borderRadius:10, border:'1px solid #e2e8f0' }} />
                        </div>
                        <button className="rm-btn rm-btn-chat" onClick={() => handleConfirmPayment("Card")} style={{ width:'100%' }}>Pay ₹{selectedPlan.amount}</button>
                      </div>
                    )}

                    {paymentMethod === 'NetBanking' && (
                      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                        <select style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #e2e8f0', background:'white' }}>
                          <option>Select your bank</option>
                          <option>SBI</option>
                          <option>HDFC</option>
                          <option>ICICI</option>
                          <option>Axis</option>
                        </select>
                        <button className="rm-btn rm-btn-chat" onClick={() => handleConfirmPayment("NetBanking")} style={{ width:'100%' }}>Login to Pay</button>
                      </div>
                    )}
                  </div>
                )}
                
                {isProcessing && (
                  <div style={{ textAlign:'center', marginTop:25 }}>
                    <div className="chat-spinner" style={{ width:25, height:25, margin:'0 auto 10px' }}></div>
                    <p style={{ color:'#6366f1', fontWeight:600, fontSize:13 }}>Securing your transaction...</p>
                  </div>
                )}
                
                <div style={{ marginTop:25, paddingTop:15, borderTop:'1px solid #f1f5f9', textAlign:'center' }}>
                  <span style={{ fontSize:10, color:'#94a3b8', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                    🔒 256-bit SSL Secure Checkout
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Backgrounds */}
      <div className="chat-bg-shape chat-shape-1"></div>
      <div className="chat-bg-shape chat-shape-2"></div>

      <div className="page-container">
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
