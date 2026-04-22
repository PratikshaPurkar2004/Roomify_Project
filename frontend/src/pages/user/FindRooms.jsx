import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Plus, MessageCircle, Home, SlidersHorizontal, X } from "lucide-react";
import "../../styles/FindRooms.css";

export default function FindRooms() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const isHost = currentUser.user_type === "Host";
  const userId = localStorage.getItem("userId");

  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [toast, setToast] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ location: "", address: "", rent: "", max_tenants: "", furnishing: "Unfurnished", amenities: "", image: null });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchRooms = () => {
    fetch("http://localhost:5000/api/rooms")
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.rooms || []);
        setRooms(list);
        setFiltered(list);
      })
      .catch(() => setRooms([]));
  };

  useEffect(() => {
    fetchRooms();
    fetch("http://localhost:5000/api/cities/all")
      .then(r => r.json())
      .then(d => { if (d.success) setAllCities(d.cities); });
  }, []);

  useEffect(() => {
    let result = rooms;
    if (city) result = result.filter(r => String(r.location || "").toLowerCase().includes(city.toLowerCase()));
    if (budget) result = result.filter(r => Number(r.rent) <= Number(budget));
    if (furnishing) result = result.filter(r => r.furnishing === furnishing);
    setFiltered(result);
  }, [city, budget, furnishing, rooms]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("host_id", userId);
    Object.entries(newRoom).forEach(([key, val]) => {
      if (val !== null && val !== "") formData.append(key, val);
    });

    try {
      const res = await fetch("http://localhost:5000/api/rooms/add", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        showToast("Room added successfully ✅");
        setShowAddModal(false);
        setNewRoom({ location: "", address: "", rent: "", max_tenants: "", furnishing: "Unfurnished", amenities: "", image: null });
        fetchRooms();
      } else {
        showToast(data.message || "Failed to add room");
      }
    } catch {
      showToast("Error adding room");
    }
  };


  return (
    <div className="fr-page">
      {/* Animated Background */}
      <div className="fr-blob fr-blob-1" />
      <div className="fr-blob fr-blob-2" />

      {toast && <div className="fr-toast">{toast}</div>}

      {/* Hero Banner */}
      <div className="fr-hero">
        <div className="fr-hero-text">
          <span className="fr-hero-badge">🏠 Available Rooms</span>
          <h1>Find Your Perfect <span className="fr-gradient-text">Room</span></h1>
          <p>Browse verified listings from trusted hosts. Filter by city, budget & furnishing.</p>
        </div>
        <div className="fr-hero-stats">
          <div className="fr-stat-pill">
            <span className="fr-stat-num">{rooms.length}</span>
            <span>Listings</span>
          </div>
          <div className="fr-stat-pill">
            <span className="fr-stat-num">{rooms.filter(r => r.availability === "available").length}</span>
            <span>Available</span>
          </div>
          <div className="fr-stat-pill">
            <span className="fr-stat-num">{allCities.length}</span>
            <span>Cities</span>
          </div>
        </div>
      </div>

      {/* Filter + Add Bar */}
      <div className="fr-toolbar">
        <div className="fr-filter-bar">
          <div className="fr-filter-group">
            <MapPin size={16} className="fr-filter-icon" />
            <input
              type="text"
              placeholder="Search city..."
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>
          <div className="fr-filter-group">
            <span className="fr-filter-icon fr-rupee">₹</span>
            <input
              type="number"
              placeholder="Max Budget"
              value={budget}
              onChange={e => setBudget(e.target.value)}
            />
          </div>
          <div className="fr-filter-group">
            <SlidersHorizontal size={16} className="fr-filter-icon" />
            <select value={furnishing} onChange={e => setFurnishing(e.target.value)}>
              <option value="">All Furnishing</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Fully-Furnished">Fully-Furnished</option>
            </select>
          </div>
          <button className="fr-search-btn">
            <Search size={16} /> Search
          </button>
        </div>

          <button className="fr-add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Room
          </button>
      </div>

      {/* Room Grid */}
      <div className="fr-grid">
        {filtered.length === 0 ? (
          <div className="fr-empty">
            <Home size={56} />
            <h3>No Rooms Found</h3>
            <p>Try changing your filters or check back later.</p>
          </div>
        ) : (
          filtered.map(room => (
            <div className="fr-card" key={room.room_id}>
              <div className="fr-card-img-wrap">
                {room.image_url
                  ? <img src={`http://localhost:5000${room.image_url}`} alt="Room" />
                  : <div className="fr-card-img-placeholder"><Home size={40} /></div>
                }
                <span className={`fr-badge-avail ${room.availability}`}>
                  {room.availability === "available" ? "✓ Available" : "Booked"}
                </span>
                <span className="fr-rent-pill">₹{Number(room.rent).toLocaleString()}/mo</span>
              </div>

              <div className="fr-card-body">
                <h3>Room in {room.location?.split(",")[0]}</h3>
                <div className="fr-card-location">
                  <MapPin size={13} />
                  <span>{room.location}</span>
                </div>

                <div className="fr-card-tags">
                  {room.furnishing && <span className="fr-tag">{room.furnishing}</span>}
                  {room.max_tenants && <span className="fr-tag">👥 {room.max_tenants} tenants</span>}
                  {room.amenities && room.amenities.split(",").slice(0, 2).map((a, i) => (
                    <span className="fr-tag" key={i}>{a.trim()}</span>
                  ))}
                </div>

                {room.host_name && (
                  <div className="fr-host-row">
                    <div className="fr-host-avatar">{room.host_name?.charAt(0)}</div>
                    <span>{room.host_name}</span>
                  </div>
                )}
              </div>

              <div className="fr-card-footer">
                <button
                  className="fr-contact-btn"
                  onClick={() => navigate("/dashboard/chat")}
                >
                  <MessageCircle size={16} /> Contact Host
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fr-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="fr-modal" onClick={e => e.stopPropagation()}>
            <div className="fr-modal-header">
              <h3>Add New Room</h3>
              <X size={22} className="fr-modal-close" onClick={() => setShowAddModal(false)} />
            </div>
            <form onSubmit={handleAddRoom} className="fr-modal-form">
              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Area / City *</label>
                  <input required placeholder="e.g. Pune, Maharashtra" value={newRoom.location} onChange={e => setNewRoom({ ...newRoom, location: e.target.value })} />
                </div>
                <div className="fr-form-group">
                  <label>Complete Address *</label>
                  <input required placeholder="Flat 101, MG Road" value={newRoom.address} onChange={e => setNewRoom({ ...newRoom, address: e.target.value })} />
                </div>
              </div>
              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Monthly Rent (₹) *</label>
                  <input required type="number" placeholder="e.g. 8000" value={newRoom.rent} onChange={e => setNewRoom({ ...newRoom, rent: e.target.value })} />
                </div>
                <div className="fr-form-group">
                  <label>No. of Tenants</label>
                  <input type="number" placeholder="e.g. 2" value={newRoom.max_tenants} onChange={e => setNewRoom({ ...newRoom, max_tenants: e.target.value })} />
                </div>
              </div>
              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Furnishing</label>
                  <select value={newRoom.furnishing} onChange={e => setNewRoom({ ...newRoom, furnishing: e.target.value })}>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Fully-Furnished</option>
                  </select>
                </div>
                <div className="fr-form-group">
                  <label>Amenities</label>
                  <input placeholder="WiFi, AC, Gym..." value={newRoom.amenities} onChange={e => setNewRoom({ ...newRoom, amenities: e.target.value })} />
                </div>
              </div>
              <div className="fr-form-group">
                <label>Room Photo</label>
                <input type="file" accept="image/*" onChange={e => setNewRoom({ ...newRoom, image: e.target.files[0] })} />
              </div>
              <div className="fr-modal-actions">
                <button type="button" className="fr-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="fr-modal-submit"><Plus size={16} /> Add Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
