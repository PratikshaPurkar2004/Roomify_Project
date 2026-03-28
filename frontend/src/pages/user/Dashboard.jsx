import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { Users, Home, FileText, UserPlus, UserSearch, Plus, MapPin, DollarSign, X, TrendingUp, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateMatchPercentage } from "../../utils/matchUtils";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [showUsers, setShowUsers] = useState(false);
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
    "Defining the future of co-living and shared spaces.",
    "Connecting modern professionals with premium living experiences.",
    "Your bridge to comfortable, convenient, and collaborative living.",
    "Simplifying the journey to your next perfect home.",
    "Where professional networks find personal comfort."
  ];
  const [randomPhrase] = useState(phrases[Math.floor(Math.random() * phrases.length)]);

  const chartData = [
    { name: 'Mon', views: Math.floor((stats.views || 10) * 0.4), matches: Math.floor((stats.views || 5) * 0.2) },
    { name: 'Tue', views: Math.floor((stats.views || 15) * 0.6), matches: Math.floor((stats.views || 8) * 0.3) },
    { name: 'Wed', views: Math.floor((stats.views || 25) * 0.8), matches: Math.floor((stats.views || 12) * 0.5) },
    { name: 'Thu', views: Math.floor((stats.views || 20) * 0.7), matches: Math.floor((stats.views || 10) * 0.4) },
    { name: 'Fri', views: Math.floor((stats.views || 30) * 0.9), matches: Math.floor((stats.views || 18) * 0.6) },
    { name: 'Sat', views: (stats.views || 42), matches: Math.floor((stats.views || 24) * 0.7) },
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
    formData.append("rent", editRoom.rent);
    formData.append("availability", editRoom.availability);
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
      rent: room.rent,
      availability: room.availability,
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
    formData.append("rent", newRoom.rent);
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
        {/* Redesigned Premium Hero Section */}
        <div className="dashboard-hero-premium">
          <div className="hero-main-content">
            <div className="hero-text-overlay">
              <span className="hero-badge">{isHost ? "Host Dashboard" : "Finder Dashboard"}</span>
              <h1>{isHost ? "Ready to find your next roommate?" : "Find your dream space today"}</h1>
              <p>
                {isHost
                  ? "Manage your rooms, track requests, and connect with people who share your lifestyle."
                  : "Explore hundreds of verified listings and find the perfect roommate that matches your vibe."
                }
              </p>

              <div className="hero-actions-premium">
                {isHost ? (
                  <button className="hero-btn-premium add" onClick={() => setShowAddRoomModal(true)}>
                    <Plus size={20} /> List New Room
                  </button>
                ) : (
                  <button className="hero-btn-premium add finder-action" onClick={() => navigate("/dashboard/find-roommates")}>
                    <UserSearch size={20} /> Explore Rooms
                  </button>
                )}
              </div>

              {/* Stats Bar Integrated Inside Hero */}
              <div className="hero-stats-bar">
                {isHost ? (
                  <>
                    <div className="stat-item">
                      <span className="stat-num">{myRooms.length}</span>
                      <span className="stat-desc">Managed Rooms</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item clickable" onClick={() => navigate("/dashboard/requests")}>
                      <span className="stat-num">{stats.requests}</span>
                      <span className="stat-desc">New Requests</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item clickable" onClick={() => navigate("/dashboard/find-roommates")}>
                      <span className="stat-num">{stats.finders}</span>
                      <span className="stat-desc">Match Matches</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat-item clickable" onClick={() => navigate("/dashboard/find-roommates")}>
                      <span className="stat-num">{stats.views || 0}</span>
                      <span className="stat-desc">Total Views</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item clickable" onClick={() => navigate("/dashboard/requests")}>
                      <span className="stat-num">{stats.requests}</span>
                      <span className="stat-desc">Pending Requests</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item clickable" onClick={() => navigate("/dashboard/find-roommates")}>
                      <span className="stat-num">{stats.hosts}</span>
                      <span className="stat-desc">Featured Hosts</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="hero-image-container">
              <img
                src="/assets/images/hero_banner.png"
                alt=""
                className="hero-img-main"
              />
              <div className="img-overlay-gradient"></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-icon requests">
            <FileText size={24} />
          </div>
          <div>
            <p>Total Requests</p>
            <h2>{stats.requests}</h2>
          </div>
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
              <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.8)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                padding: '12px'
              }}
              cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#6366f1"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorViews)"
              activeDot={{ r: 8, strokeWidth: 3, stroke: 'white' }}
            />
            <Area
              type="monotone"
              dataKey="matches"
              stroke="#a855f7"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorMatches)"
              activeDot={{ r: 8, strokeWidth: 3, stroke: 'white' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-footer-grid">
        <div className="footer-stat">
          <span className="f-label">Profile Authority</span>
          <span className="f-value">92%</span>
        </div>
        <div className="footer-stat">
          <span className="f-label">Search Visibility</span>
          <span className="f-value">High</span>
        </div>
        <div className="footer-stat">
          <span className="f-label">Response Velocity</span>
          <span className="f-value">~2h</span>
        </div>
      </div>
    </div>
            </div >
        )
}

{/* Host Room Management Header */ }
{
  isHost && (
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
                  <span className="room-status">{room.availability}</span>
                </div>
                <div className="room-details">
                  <p className="room-price">₹{room.rent}</p>
                  <p className="room-location">
                    <MapPin size={14} /> {room.location}
                  </p>
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
          <p className="no-users">You haven't added any rooms yet.</p>
        )}
      </div>
    </div>
  )
}


      </div >

  {/* Add Room Modal */ }
{
  showAddRoomModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Add New Room</h3>
          <X size={24} onClick={() => setShowAddRoomModal(false)} style={{ cursor: 'pointer', color: '#64748b' }} />
        </div>
        <form onSubmit={handleAddRoom}>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Pune, Maharashtra"
              value={newRoom.location}
              onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Monthly Rent (₹)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={newRoom.rent}
              onChange={(e) => setNewRoom({ ...newRoom, rent: e.target.value })}
              required
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
              List Room
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
{/* Edit Room Modal */ }
{
  showEditRoomModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Edit Room</h3>
          <X size={24} onClick={() => setShowEditRoomModal(false)} style={{ cursor: 'pointer', color: '#64748b' }} />
        </div>
        <form onSubmit={handleEditRoomSubmit}>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={editRoom.location}
              onChange={(e) => setEditRoom({ ...editRoom, location: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Monthly Rent (₹)</label>
            <input
              type="number"
              value={editRoom.rent}
              onChange={(e) => setEditRoom({ ...editRoom, rent: e.target.value })}
              required
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
  )
}

{/* View Room Modal */ }
{
  showViewRoomModal && selectedRoom && (
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
              <span className="label">Location:</span>
              <span className="value">{selectedRoom.location}</span>
            </div>
            <div className="detail-item">
              <span className="label">Monthly Rent:</span>
              <span className="value">₹{selectedRoom.rent}</span>
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
  )
}
    </div >
  );
}

export default Dashboard;
