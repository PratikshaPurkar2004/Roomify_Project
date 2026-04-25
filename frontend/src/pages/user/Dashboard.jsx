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
  ArrowRight
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
  const [showViewRoomModal, setShowViewRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({ location: "", rent: "", image: null });
  const [editRoom, setEditRoom] = useState({ location: "", rent: "", availability: "available", image: null });
  
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
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

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

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
    {
      src: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      alt: "Modern Living Room"
    },
    {
      src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
      alt: "Roommates sharing a living space"
    },
    {
      src: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      alt: "Cozy bedroom for rent"
    },
    {
      src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      alt: "Happy roommates in apartment"
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const chartData = [
    { name: 'Mon', views: 400, matches: 240 },
    { name: 'Tue', views: 600, matches: 300 },
    { name: 'Wed', views: 800, matches: 500 },
    { name: 'Thu', views: 700, matches: 400 },
    { name: 'Fri', views: 900, matches: 600 },
    { name: 'Sat', views: 1240, matches: 870 },
  ];

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5000/api/dashboard/stats?userId=${userId}`)
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, ...data })))
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/matches/optimal/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.topMatch) {
          setTopMatch(data.topMatch);
        }
      })
      .catch(err => console.error(err));

    if (isHost) {
      fetch(`http://localhost:5000/api/rooms/host/${userId}`)
        .then(res => res.json())
        .then(data => { if (data.success) setMyRooms(data.rooms); })
        .catch(err => console.error(err));

      if (isHost) {
        fetch(`http://localhost:5000/api/rooms/host/${userId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setMyRooms(data.rooms);
            }
          })
          .catch(err => console.error(err));
      }
    }
  }, [isHost]);

  const handleDeleteRoom = (roomId) => {
    if (!window.confirm("Are you sure?")) return;
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
          window.location.reload();
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
          window.location.reload();
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
        <div className="dashboard-hero-premium">
          <div className="hero-main-content">
            <div className="hero-text-overlay">
              <span className="hero-badge">WELCOME BACK, {currentUser.name?.toUpperCase() || "USER"}</span>
              <h1>Find your perfect <span className="text-gradient">room and roommate</span></h1>
              <p>{randomPhrase}</p>

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
                  <span className="stat-num">{stats.views}</span>
                  <span className="stat-desc">#Views</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-num">{stats.matches}</span>
                  <span className="stat-desc">#Matches</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item clickable" onClick={() => navigate("/dashboard/requests")}>
                  <span className="stat-num">{stats.requests}</span>
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

        <div className="dash-two-column-layout">
          <div className="dash-match-highlight">
            <div className="premium-card match-card-gs">
              <div className="match-card-header">
                <div className="gs-badge"><Zap size={14} /> GALE-SHAPLEY OPTIMAL</div>
                <h3>Recommended for You</h3>
              </div>
              
              {topMatch ? (
                <div className="gs-match-profile">
                  <div className="gs-avatar-container">
                    <img src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="Match" className="gs-avatar" />
                    <div className="match-percent-ring">{topMatch.matchScore}%</div>
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
                  <Activity size={40} />
                  <p>Calculating your best matches...</p>
                </div>
              )}
            </div>

            <div className="analytics-card-glass mt-4">
              <div className="analytics-header-compact">
                <div className="header-meta">
                  <div className="icon-badge-violet"><Activity size={20} /></div>
                  <div>
                    <h3>Performance Analytics</h3>
                    <p>Overview of platform engagement</p>
                  </div>
                ))
              ) : (
                <div className="empty-state-card">
                  <Home size={40} />
                  <p>You haven't added any rooms yet.</p>
                  <button className="add-room-btn-inline" onClick={() => setShowAddRoomModal(true)}>Add Your First Room</button>
                </div>
                <div className="stats-pill-green">
                  <TrendingUp size={16} /> <span>Engagement High</span>
                </div>
              </div>

              <div className="chart-wrapper-premium">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)'}}/>
                    <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" name="Total Views" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="dash-management-column">
            {isHost && (
              <div className="management-card">
                <div className="management-header">
                  <h3>Your Managed Listings</h3>
                  <button className="add-room-small-btn" onClick={() => setShowAddRoomModal(true)}><Plus size={16}/></button>
                </div>
                <div className="mini-rooms-list">
                  {myRooms.length > 0 ? myRooms.slice(0, 3).map(room => (
                    <div key={room.room_id} className="mini-room-item">
                      <div className="mini-room-info">
                        <p className="mini-room-title">Room in {room.location.split(',')[0]}</p>
                        <p className="mini-room-price">₹{room.rent}</p>
                      </div>
                      <div className="mini-actions">
                        <button onClick={() => openEditModal(room)} className="mini-edit-btn"><Plus size={12} /></button>
                        <button onClick={() => handleDeleteRoom(room.room_id)} className="mini-del-btn"><X size={12} /></button>
                      </div>
                    </div>
                  )) : (
                    <p className="empty-mini">No listings yet.</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="quick-stats-card">
              <h3>System Overview</h3>
              <div className="quick-stats-grid">
                <div className="quick-stat-box">
                  <span className="q-label">Total Users</span>
                  <span className="q-val">{stats.users || 450}</span>
                </div>
                <div className="quick-stat-box">
                  <span className="q-label">Active Listings</span>
                  <span className="q-val">{stats.rooms || 120}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Room</h3>
            <form onSubmit={handleAddRoom}>
              <input type="text" placeholder="Location" value={newRoom.location} onChange={e => setNewRoom({...newRoom, location: e.target.value})} required />
              <input type="number" placeholder="Rent" value={newRoom.rent} onChange={e => setNewRoom({...newRoom, rent: e.target.value})} required />
              <input type="file" onChange={e => setNewRoom({...newRoom, image: e.target.files[0]})} />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddRoomModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Room</h3>
            <form onSubmit={handleEditRoomSubmit}>
              <input type="text" value={editRoom.location} onChange={e => setEditRoom({...editRoom, location: e.target.value})} required />
              <input type="number" value={editRoom.rent} onChange={e => setEditRoom({...editRoom, rent: e.target.value})} required />
              <select value={editRoom.availability} onChange={e => setEditRoom({...editRoom, availability: e.target.value})}>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditRoomModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
