import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { 
  Users, 
  Home, 
  FileText, 
  UserPlus, 
  UserSearch, 
  Plus, 
  MapPin, 
  DollarSign, 
  X, 
  TrendingUp, 
  Activity, 
  Search,
  Zap,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Edit2,
  Trash2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    requests: 0,
    hosts: 0,
    finders: 0,
    views: 1240,
    matches: 0,
  });

  const [topMatch, setTopMatch] = useState(null);
  const [myRooms, setMyRooms] = useState([]);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({ location: "", rent: "", image: null });
  const [editRoom, setEditRoom] = useState({ location: "", rent: "", availability: "available", image: null });
  
  const [graphData, setGraphData] = useState([]);
  const [activeMetric, setActiveMetric] = useState("views");

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();
  const isHost = currentUser.user_type === "Host";

  const phrases = [
    "Find your ideal room and the perfect roommate to share it with.",
    "Matching verified rooms with the best roommate for you.",
    "The simplest way to find premium spaces and verified roommates.",
    "Connecting modern professionals to verified rooms and great roommates.",
    "Your home, your choice: shared rooms and great roommates in one place."
  ];
  const [randomPhrase] = useState(phrases[Math.floor(Math.random() * phrases.length)]);

  // Hero Image Carousel
  const heroImages = [
    { src: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", alt: "Modern Living Room" },
    { src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg", alt: "Roommates sharing space" },
    { src: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg", alt: "Cozy bedroom" },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const fetchData = useCallback(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Fetch Stats
    fetch(`http://localhost:5000/api/dashboard/stats?userId=${userId}`)
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, ...data })))
      .catch(err => console.error(err));

    // Fetch Graph Data
    fetch(`http://localhost:5000/api/dashboard/graph-data?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setGraphData(data);
        } else {
          // Fallback static data if API fails or returns empty
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          setGraphData(days.map(d => ({ name: d, views: Math.floor(Math.random() * 100), matches: Math.floor(Math.random() * 20), requests: Math.floor(Math.random() * 10) })));
        }
      })
      .catch(err => console.error(err));

    // Fetch Top Match
    fetch(`http://localhost:5000/api/matches/optimal/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.topMatch) {
          setTopMatch(data.topMatch);
        }
      })
      .catch(err => console.error(err));

    // Fetch Host Rooms
    if (isHost) {
      fetch(`http://localhost:5000/api/rooms/host/${userId}`)
        .then(res => res.json())
        .then(data => { if (data.success) setMyRooms(data.rooms); })
        .catch(err => console.error(err));
    }
  }, [isHost]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDeleteRoom = (roomId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    fetch(`http://localhost:5000/api/rooms/delete/${roomId}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMyRooms(prev => prev.filter(r => r.room_id !== roomId));
        }
      });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("host_id", userId);
    formData.append("location", newRoom.location);
    formData.append("rent", newRoom.rent);
    if (newRoom.image) formData.append("image", newRoom.image);

    fetch("http://localhost:5000/api/rooms/add", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShowAddRoomModal(false);
          fetchData();
        }
      });
  };

  const handleEditRoomSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("location", editRoom.location);
    formData.append("rent", editRoom.rent);
    formData.append("availability", editRoom.availability);
    if (editRoom.image) formData.append("image", editRoom.image);

    fetch(`http://localhost:5000/api/rooms/edit/${selectedRoom.room_id}`, { method: "PUT", body: formData })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShowEditRoomModal(false);
          fetchData();
        }
      });
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setEditRoom({ location: room.location, rent: room.rent, availability: room.availability, image: null });
    setShowEditRoomModal(true);
  };

  return (
    <div className="dashboard">
      <div className="dash-bg-shape dash-shape-1"></div>
      <div className="dash-bg-shape dash-shape-2"></div>
      
      <div className="dashboard-container">
        {/* Premium Hero Section */}
        <div className="dashboard-hero-premium">
          <div className="hero-main-content">
            <div className="hero-text-overlay">
              <span className="hero-badge">WELCOME BACK, {currentUser.name?.toUpperCase() || "USER"}</span>
              <h1>Find your perfect <span className="text-gradient">room and roommate</span></h1>
              <p className="hero-subtitle">{randomPhrase}</p>

              <div className="hero-actions-premium">
                <button className="hero-btn-premium find-rooms" onClick={() => navigate("/dashboard/find-rooms")}>
                  <Search size={20} /> Find Rooms
                </button>
                <button className="hero-btn-premium find-roommates" onClick={() => navigate("/dashboard/find-roommates")}>
                  <UserSearch size={20} /> Find Roommates
                </button>
              </div>

              <div className="hero-stats-bar">
                <div className="stat-item">
                  <span className="stat-num">{stats.views || 0}</span>
                  <span className="stat-desc">#Views</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-num">{stats.matches || 0}</span>
                  <span className="stat-desc">#Matches</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item clickable" onClick={() => navigate("/dashboard/requests")}>
                  <span className="stat-num">{stats.requests || 0}</span>
                  <span className="stat-desc">#Requests</span>
                </div>
              </div>
            </div>
            
            <div className="hero-image-container">
              <div className="hero-carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {heroImages.map((img, idx) => (
                  <img key={idx} src={img.src} alt={img.alt} className="hero-img-main" />
                ))}
              </div>
              <div className="img-overlay-gradient"></div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="dash-two-column-layout">
          {/* Left Column: Recommendations & Analytics */}
          <div className="dash-match-highlight">
            <div className="premium-card match-card-gs">
              <div className="match-card-header">
                <div className="gs-badge"><Zap size={14} /> RECOMMENDED MATCH</div>
                <h3>Best Compatible Profile</h3>
              </div>
              
              {topMatch ? (
                <div className="gs-match-profile">
                  <div className="gs-avatar-container">
                    <img src={topMatch.profile_pic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="Match" className="gs-avatar" />
                    <div className="match-percent-ring">{topMatch.matchScore || 0}%</div>
                  </div>
                  <div className="gs-info">
                    <h4>{topMatch.name}</h4>
                    <p><MapPin size={14} /> {topMatch.city || "Nearby"}</p>
                    <button className="gs-connect-btn" onClick={() => navigate("/dashboard/find-roommates")}>
                      Connect <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="gs-empty">
                  <Activity size={40} className="animate-pulse" />
                  <p>Discovering your perfect roommate...</p>
                </div>
              )}
            </div>

            {/* Analytics Card */}
            <div className="analytics-card-glass mt-4">
              <div className="analytics-header-compact">
                <div className="header-meta">
                  <div className="icon-badge-violet"><Activity size={20} /></div>
                  <div>
                    <h3>Performance Analytics</h3>
                    <p>Track your profile engagement</p>
                  </div>
                </div>
                <div className="stats-pill-green">
                  <TrendingUp size={16} /> <span>Live Updates</span>
                </div>
              </div>

              <div className="chart-wrapper-premium">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={graphData.length > 0 ? graphData : [
                    { name: 'Mon', views: 20, matches: 5 },
                    { name: 'Tue', views: 40, matches: 8 },
                    { name: 'Wed', views: 35, matches: 12 },
                    { name: 'Thu', views: 50, matches: 15 },
                    { name: 'Fri', views: 70, matches: 20 },
                    { name: 'Sat', views: 90, matches: 25 },
                    { name: 'Sun', views: 80, matches: 22 },
                  ]}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)'}}/>
                    <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Views" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Listings & Quick Stats */}
          <div className="dash-management-column">
            {isHost && (
              <div className="management-card premium-card">
                <div className="management-header">
                  <h3>Your Listings</h3>
                  <button className="add-room-small-btn" onClick={() => setShowAddRoomModal(true)}>
                    <Plus size={16}/> Add New
                  </button>
                </div>
                <div className="mini-rooms-list">
                  {myRooms.length > 0 ? myRooms.slice(0, 4).map(room => (
                    <div key={room.room_id} className="mini-room-item">
                      <div className="mini-room-img">
                        <img src={room.image_url ? `http://localhost:5000${room.image_url}` : "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"} alt="Room" />
                      </div>
                      <div className="mini-room-info">
                        <p className="mini-room-title">{room.location.split(',')[0]}</p>
                        <p className="mini-room-price">₹{room.rent}</p>
                      </div>
                      <div className="mini-actions">
                        <button onClick={() => openEditModal(room)} className="mini-btn-icon edit" title="Edit"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteRoom(room.room_id)} className="mini-btn-icon delete" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )) : (
                    <div className="empty-mini-state">
                      <Home size={32} opacity={0.3} />
                      <p>No listings yet.</p>
                    </div>
                  )}
                </div>
                {myRooms.length > 4 && <button className="view-all-btn" onClick={() => navigate("/dashboard/my-rooms")}>View All Listings</button>}
              </div>
            )}
            
            <div className="quick-stats-card premium-card">
              <h3>System Statistics</h3>
              <div className="quick-stats-grid">
                <div className="quick-stat-box">
                  <div className="q-icon-wrap blue"><Users size={18} /></div>
                  <div className="q-data">
                    <span className="q-val">{stats.users || 0}</span>
                    <span className="q-label">Total Users</span>
                  </div>
                </div>
                <div className="quick-stat-box">
                  <div className="q-icon-wrap purple"><Home size={18} /></div>
                  <div className="q-data">
                    <span className="q-val">{stats.rooms || 0}</span>
                    <span className="q-label">Live Listings</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-card invite-card">
              <div className="invite-content">
                <h4>Invite Friends</h4>
                <p>Share Roomify and help others find their perfect homes.</p>
                <button className="invite-btn">Share Link</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content premium-modal">
            <div className="modal-header">
              <h3>Add New Room</h3>
              <button onClick={() => setShowAddRoomModal(false)} className="close-modal-btn"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddRoom} className="premium-form">
              <div className="form-group">
                <label>Location</label>
                <input type="text" placeholder="e.g. Pune, Maharashtra" value={newRoom.location} onChange={e => setNewRoom({...newRoom, location: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Monthly Rent (₹)</label>
                <input type="number" placeholder="e.g. 5000" value={newRoom.rent} onChange={e => setNewRoom({...newRoom, rent: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Room Image</label>
                <input type="file" onChange={e => setNewRoom({...newRoom, image: e.target.files[0]})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddRoomModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Create Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content premium-modal">
            <div className="modal-header">
              <h3>Edit Room Listing</h3>
              <button onClick={() => setShowEditRoomModal(false)} className="close-modal-btn"><X size={20}/></button>
            </div>
            <form onSubmit={handleEditRoomSubmit} className="premium-form">
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={editRoom.location} onChange={e => setEditRoom({...editRoom, location: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Monthly Rent (₹)</label>
                <input type="number" value={editRoom.rent} onChange={e => setEditRoom({...editRoom, rent: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={editRoom.availability} onChange={e => setEditRoom({...editRoom, availability: e.target.value})}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditRoomModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

