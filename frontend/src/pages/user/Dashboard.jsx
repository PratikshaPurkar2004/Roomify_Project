import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { Users, Home, FileText, UserPlus, UserSearch, Plus, MapPin, DollarSign, X, TrendingUp, Activity, Search } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateMatchPercentage } from "../../utils/matchUtils";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    requests: 0,
    hosts: 0,
    finders: 0,
    views: 0,
  });

  const [users, setUsers] = useState([]);
  const [myPreferences, setMyPreferences] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [showViewRoomModal, setShowViewRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({ location: "", rent: "", image: null });
  const [editRoom, setEditRoom] = useState({ location: "", rent: "", availability: "", image: null });

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const isHost = currentUser.user_type === "Host";

  const hosts = users.filter((u) => u.user_type === "Host");
  const finders = users.filter((u) => u.user_type === "Finder");

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

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartRef.current - touchEndRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const chartData = [
    { name: 'Mon', views: Math.floor((stats.views || 0) * 0.4), matches: Math.floor((stats.views || 0) * 0.2) },
    { name: 'Tue', views: Math.floor((stats.views || 0) * 0.6), matches: Math.floor((stats.views || 0) * 0.3) },
    { name: 'Wed', views: Math.floor((stats.views || 0) * 0.8), matches: Math.floor((stats.views || 0) * 0.5) },
    { name: 'Thu', views: Math.floor((stats.views || 0) * 0.7), matches: Math.floor((stats.views || 0) * 0.4) },
    { name: 'Fri', views: Math.floor((stats.views || 0) * 0.9), matches: Math.floor((stats.views || 0) * 0.6) },
    { name: 'Sat', views: (stats.views || 0), matches: Math.floor((stats.views || 0) * 0.7) },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userIdParams = userId ? `?userId=${userId}` : "";

    fetch(`http://localhost:5000/api/dashboard/stats${userIdParams}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/dashboard/users")
      .then((res) => res.json())
      .then((data) => {
        const userList = data.users || [];
        setUsers(userList);

        const hostCount = userList.filter((u) => u.user_type === "Host").length;
        const finderCount = userList.filter((u) => u.user_type === "Finder").length;

        setStats((prev) => ({
          ...prev,
          hosts: hostCount,
          finders: finderCount,
        }));
      })
      .catch((err) => console.error(err));

    if (userId) {
      fetch(`http://localhost:5000/api/preferences/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.preferences) {
            setMyPreferences(data.preferences.split(",").map(p => p.trim()));
          }
        })
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
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:5000/api/rooms/delete/${roomId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetch(`http://localhost:5000/api/rooms/host/${userId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success) setMyRooms(data.rooms);
            });
        }
      })
      .catch((err) => console.error(err));
  };

  const handleEditRoomSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId || !selectedRoom) return;

    const formData = new FormData();
    formData.append("location", editRoom.location);
    formData.append("address", editRoom.address || "");
    formData.append("rent", editRoom.rent);
    formData.append("availability", editRoom.availability || "available");
    formData.append("max_tenants", editRoom.max_tenants || "");
    formData.append("furnishing", editRoom.furnishing || "Unfurnished");
    formData.append("amenities", editRoom.amenities || "");
    if (editRoom.image) {
      formData.append("image", editRoom.image);
    }

    fetch(`http://localhost:5000/api/rooms/edit/${selectedRoom.room_id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShowEditRoomModal(false);
          setSelectedRoom(null);
          // Refresh rooms
          fetch(`http://localhost:5000/api/rooms/host/${userId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success) setMyRooms(data.rooms);
            });
        }
      })
      .catch((err) => console.error(err));
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setEditRoom({
      location: room.location,
      address: room.address || "",
      rent: room.rent,
      availability: room.availability || "available",
      max_tenants: room.max_tenants || "",
      furnishing: room.furnishing || "Unfurnished",
      amenities: room.amenities || "",
      image: null
    });
    setShowEditRoomModal(true);
  };

  const openViewModal = (room) => {
    setSelectedRoom(room);
    setShowViewRoomModal(true);
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const formData = new FormData();
    formData.append("host_id", userId);
    formData.append("location", newRoom.location);
    formData.append("address", newRoom.address || "");
    formData.append("rent", newRoom.rent);
    formData.append("max_tenants", newRoom.max_tenants || "");
    formData.append("furnishing", newRoom.furnishing || "Unfurnished");
    formData.append("amenities", newRoom.amenities || "");
    if (newRoom.image) {
      formData.append("image", newRoom.image);
    }

    fetch("http://localhost:5000/api/rooms/add", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShowAddRoomModal(false);
          setNewRoom({ location: "", rent: "", image: null });
          // Refresh rooms
          fetch(`http://localhost:5000/api/rooms/host/${userId}`)
            .then(res => res.json())
            .then(data => {
              if (data.success) setMyRooms(data.rooms);
            });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="dashboard">
      <div className="dash-bg-shape dash-shape-1"></div>
      <div className="dash-bg-shape dash-shape-2"></div>
      <div className="dashboard-container">
        {/* Redesigned Unified Premium Hero Section */}
        <div className="dashboard-hero-premium">
          <div className="hero-main-content">
            <div className="hero-text-overlay">
              <span className="hero-badge">WELCOME BACK, {currentUser.name || "SAYALI"}</span>
              <h1>Find your perfect <span className="text-gradient">room and roommate</span></h1>
              <p>
                Our ecosystem simplifies your search for verified listings and compatible roommates. {randomPhrase}
              </p>

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
                <div className="stat-divider"></div>
                <div className="stat-item clickable" onClick={() => navigate("/dashboard/find-roommates")}>
                  <span className="stat-num">{stats.rooms || myRooms.length}</span>
                  <span className="stat-desc">#Rooms</span>
                </div>
              </div>
            </div>
            <div
              className="hero-image-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="hero-carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {heroImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.src}
                    alt={img.alt}
                    className="hero-img-main"
                  />
                ))}
              </div>
              <div className="img-overlay-gradient"></div>

              {/* Navigation Arrows */}
              <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>&#8249;</button>
              <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>&#8250;</button>

              {/* Dots */}
              <div className="carousel-dots">
                {heroImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Global Activity Analytics */}
        <div className="finder-analytics-section-premium">
          <div className="analytics-card-glass">
            <div className="analytics-header-compact">
              <div className="header-meta">
                <div className="icon-badge-violet">
                  <Activity size={20} />
                </div>
                <div>
                  <h3>Performance Analytics</h3>
                  <p>Overview of platform engagement and total views</p>
                </div>
              </div>
              <div className="stats-pill-green">
                <TrendingUp size={16} /> <span>Engagement {stats.views > 0 ? ((stats.requests / stats.views) * 100).toFixed(1) : "0.0"}%</span>
              </div>
            </div>

            <div className="chart-wrapper-premium">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                    name="Total Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="matches"
                    stroke="#a855f7"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorEngagement)"
                    name="Total Engagement"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Host Room Management Header */}
        {isHost && (
          <div className="room-management-section">
            <div className="room-management-header">
              <h2>Your Managed Listings</h2>
            </div>

            <div className="host-rooms-grid">
              {myRooms.length > 0 ? (
                myRooms.map((room) => (
                  <div key={room.room_id} className="room-card">
                    {room.image_url ? (
                      <img src={`http://localhost:5000${room.image_url}`} alt="Room" className="room-image" />
                    ) : (
                      <div className="room-image-placeholder">No Image</div>
                    )}
                    <div className="room-card-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3>Room in {room.location.split(',')[0]}</h3>
                        <span className={`room-status ${room.availability}`}>{room.availability}</span>
                      </div>
                      <div className="room-details">
                        <p className="room-price">₹{room.rent}</p>
                        <p className="room-location">
                          <MapPin size={14} /> {room.location}
                        </p>
                        <div className="room-sub-details" style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
                          <p><strong>Address:</strong> {room.address || "N/A"}</p>
                          <p><strong>Tenants:</strong> {room.max_tenants || 1} | <strong>Status:</strong> {room.furnishing}</p>
                        </div>
                      </div>

                      <div className="room-card-actions-row">
                        <button className="room-action-btn view" onClick={() => openViewModal(room)}>View</button>
                        <button className="room-action-btn edit" onClick={() => openEditModal(room)}>Edit</button>
                        <button className="room-action-btn delete" onClick={() => handleDeleteRoom(room.room_id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-card">
                  <Home size={40} />
                  <p>You haven't added any rooms yet.</p>
                  <button className="add-room-btn-inline" onClick={() => setShowAddRoomModal(true)}>Add Your First Room</button>
                </div>
              )}
            </div>
          </div>
        )}


      </div>

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Add New Room</h3>
              <X size={24} onClick={() => setShowAddRoomModal(false)} style={{ cursor: 'pointer', color: '#64748b' }} />
            </div>
            <form onSubmit={handleAddRoom}>
              <div className="form-group">
                <label>Area/City</label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  value={newRoom.location}
                  onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Complete Address</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 101, Sunshine Apartments, MG Road"
                  value={newRoom.address || ""}
                  onChange={(e) => setNewRoom({ ...newRoom, address: e.target.value })}
                  required
                />
              </div>
              <div className="form-group-row" style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Monthly Rent (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={newRoom.rent}
                    onChange={(e) => setNewRoom({ ...newRoom, rent: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>No. of Tenants</label>
                  <input
                    type="number"
                    placeholder="e.g. 2"
                    value={newRoom.max_tenants || ""}
                    onChange={(e) => setNewRoom({ ...newRoom, max_tenants: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Furnishing Status</label>
                <select
                  value={newRoom.furnishing || "Unfurnished"}
                  onChange={(e) => setNewRoom({ ...newRoom, furnishing: e.target.value })}
                  className="modal-select"
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully-Furnished">Fully-Furnished</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amenities (Gym, WiFi, AC, etc.)</label>
                <input
                  type="text"
                  placeholder="e.g. WiFi, AC, Laundry"
                  value={newRoom.amenities || ""}
                  onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Room Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewRoom({ ...newRoom, image: e.target.files[0] })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddRoomModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Room Modal */}
      {showEditRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Edit Room</h3>
              <X size={24} onClick={() => setShowEditRoomModal(false)} style={{ cursor: 'pointer', color: '#64748b' }} />
            </div>
            <form onSubmit={handleEditRoomSubmit}>
              <div className="form-group">
                <label>Area/City</label>
                <input
                  type="text"
                  value={editRoom.location}
                  onChange={(e) => setEditRoom({ ...editRoom, location: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Complete Address</label>
                <input
                  type="text"
                  value={editRoom.address || ""}
                  onChange={(e) => setEditRoom({ ...editRoom, address: e.target.value })}
                  required
                />
              </div>
              <div className="form-group-row" style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={editRoom.rent}
                    onChange={(e) => setEditRoom({ ...editRoom, rent: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>No. of Tenants</label>
                  <input
                    type="number"
                    value={editRoom.max_tenants || ""}
                    onChange={(e) => setEditRoom({ ...editRoom, max_tenants: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Furnishing Status</label>
                <select
                  value={editRoom.furnishing || "Unfurnished"}
                  onChange={(e) => setEditRoom({ ...editRoom, furnishing: e.target.value })}
                  className="modal-select"
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully-Furnished">Fully-Furnished</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amenities</label>
                <input
                  type="text"
                  value={editRoom.amenities || ""}
                  onChange={(e) => setEditRoom({ ...editRoom, amenities: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Availability</label>
                <select
                  value={editRoom.availability}
                  onChange={(e) => setEditRoom({ ...editRoom, availability: e.target.value })}
                  className="modal-select"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              <div className="form-group">
                <label>Update Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditRoom({ ...editRoom, image: e.target.files[0] })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditRoomModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Room Modal */}
      {showViewRoomModal && selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content view-room-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Room Details</h3>
              <X size={24} onClick={() => setShowViewRoomModal(false)} style={{ cursor: 'pointer', color: '#64748b' }} />
            </div>
            <div className="view-room-details">
              {selectedRoom.image_url ? (
                <img src={`http://localhost:5000${selectedRoom.image_url}`} alt="Room" className="detail-room-img" />
              ) : (
                <div className="detail-room-img-placeholder">No Image Available</div>
              )}
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Area/City:</span>
                  <span className="value">{selectedRoom.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Complete Address:</span>
                  <span className="value">{selectedRoom.address || "Not provided"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Monthly Rent:</span>
                  <span className="value">₹{selectedRoom.rent}</span>
                </div>
                <div className="detail-item">
                  <span className="label">No. of Tenants:</span>
                  <span className="value">{selectedRoom.max_tenants || "Not specified"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Furnishing:</span>
                  <span className="value">{selectedRoom.furnishing || "Unfurnished"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Amenities:</span>
                  <span className="value">{selectedRoom.amenities || "None available"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className={`value status-badge ${selectedRoom.availability}`}>{selectedRoom.availability}</span>
                </div>
              </div>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="save-btn" onClick={() => setShowViewRoomModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
