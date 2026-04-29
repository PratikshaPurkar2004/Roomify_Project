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
  const [propertyType, setPropertyType] = useState("");

  const [toast, setToast] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dbCities, setDbCities] = useState([]);
  const [dbStates, setDbStates] = useState([]);
  const [dbCountries, setDbCountries] = useState([]);

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
    if (propertyType) result = result.filter(r => r.property_type === propertyType);
    setFiltered(result);
  }, [city, budget, furnishing, propertyType, rooms]);


  const handleAddRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("host_id", userId);
    Object.entries(newRoom).forEach(([key, val]) => {
      if (key === "images") {
        val.forEach(file => formData.append("images", file));
      } else if (val !== null && val !== "") {
        formData.append(key, val);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/api/rooms/add", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        showToast("Room added successfully! 🎉");
        setShowAddModal(false);
        setNewRoom({ location: "", address: "", state: "", country: "", rent: "", max_tenants: "", required_tenants: "", property_type: "Stand Alone Building", furnishing: "Unfurnished", amenities: "", images: [] });
        fetchRooms();
      } else {
        showToast(data.message || "Failed to add room");
      }
    } catch {
      showToast("Error adding room");
    }
  };

  const openDetailModal = (room) => {
    navigate(`/dashboard/room-details/${room.room_id}`);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/cities?all=true")
      .then(r => r.json())
      .then(d => { if (d.success) setDbCities(d.cities); })
      .catch(() => {});

    fetch("http://localhost:5000/api/cities/states")
      .then(r => r.json())
      .then(d => { if (d.success) setDbStates(d.states); })
      .catch(() => {});

    fetch("http://localhost:5000/api/cities/countries")
      .then(r => r.json())
      .then(d => { if (d.success) setDbCountries(d.countries); })
      .catch(() => {});
  }, []);

  return (
    <div className="fr-page">
      {/* Animated Background */}
      <div className="fr-blob fr-blob-1" />
      <div className="fr-blob fr-blob-2" />

      {toast && <div className="fr-toast">{toast}</div>}



      {/* Filter + Add Bar */}
      <div className="fr-toolbar">
        <div className="fr-filter-bar">
          <div className="fr-filter-group">
            <MapPin size={16} className="fr-filter-icon" />
            <select value={city} onChange={e => setCity(e.target.value)}>
              <option value="">All Cities</option>
              {dbCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="fr-filter-group">
            <span className="fr-filter-icon fr-rupee">₹</span>
            <input
              type="number"
              placeholder="Max Budget"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              step="100"
              min="0"
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
          <div className="fr-filter-group">
            <Home size={16} className="fr-filter-icon" />
            <select value={propertyType} onChange={e => setPropertyType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Flat/Apartment">Flat / Apartment</option>
              <option value="Independent House">Independent House</option>
              <option value="Bungalow / Villa">Bungalow / Villa</option>
              <option value="PG / Hostel">PG / Hostel</option>
            </select>
          </div>
          <button className="fr-search-btn">
            <Search size={16} /> Search
          </button>
        </div>
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
            <RoomCard key={room.room_id} room={room} onOpen={() => openDetailModal(room)} />
          ))
        )}
      </div>

    </div>
  );
}

function RoomCard({ room, onOpen }) {
  const [idx, setIdx] = useState(0);
  let images = [];
  try {
    images = JSON.parse(room.image_url);
    if (!Array.isArray(images)) images = [room.image_url];
  } catch {
    images = room.image_url ? [room.image_url] : [];
  }

  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };
  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };

  return (
    <div className="fr-card-modern">
      <div className="fr-card-img-wrap-modern" onClick={onOpen} style={{ cursor: 'pointer', position: 'relative' }}>
        {images.length > 0 ? (
          <>
            <img src={`http://localhost:5000${images[idx]}`} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="fr-card-arrow-mini l" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><ChevronLeft size={16} color="#0f172a" /></button>
                <button onClick={next} className="fr-card-arrow-mini r" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><ChevronRight size={16} color="#0f172a" /></button>
                <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                  {images.map((_, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === idx ? 'white' : 'rgba(255,255,255,0.5)' }} />)}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="fr-card-img-placeholder-modern"><Home size={40} /></div>
        )}
        <div className="fr-card-badges">
          <span className={`fr-badge-modern ${room.availability}`}>{room.availability === "available" ? "✓ AVAILABLE" : "BOOKED"}</span>
          <span className="fr-property-type-badge">{room.property_type || "Standard"}</span>
        </div>
        <div className="fr-rent-tag-modern">₹{Number(room.rent).toLocaleString()}<span>/mo</span></div>
      </div>

      <div className="fr-card-body-modern">
        <div className="fr-card-header-modern">
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{room.property_type || "Room"} in {room.location?.split(",")[0]}</h3>
          <p className="fr-card-addr"><MapPin size={13} /> {room.address ? `${room.address}, ` : ""}{room.location}</p>
        </div>
        <div className="fr-card-details-grid" style={{ background:'#f8fafc', padding:'12px', borderRadius:'12px', marginTop:'12px' }}>
          <div className="fr-detail-row" style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', paddingBottom:6, borderBottom:'1px dashed #e2e8f0' }}>
            <span style={{ color:'#94a3b8', fontWeight:600 }}>Rent</span>
            <span style={{ color:'#10b981', fontWeight:700 }}>₹{Number(room.rent).toLocaleString()}</span>
          </div>
          <div className="fr-detail-row" style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', padding: '6px 0', borderBottom:'1px dashed #e2e8f0' }}>
            <span style={{ color:'#94a3b8', fontWeight:600 }}>Looking For</span>
            <span style={{ color:'#1e293b', fontWeight:700 }}>{room.required_tenants || 1} Roommate(s)</span>
          </div>
          <div className="fr-detail-row" style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', paddingTop: 6 }}>
            <span style={{ color:'#94a3b8', fontWeight:600 }}>Furnishing</span>
            <span style={{ color:'#4f46e5', fontWeight:700 }}>{room.furnishing || "Unfurnished"}</span>
          </div>
        </div>

        <div className="fr-amenities-mini" style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {room.amenities ? room.amenities.split(',').slice(0, 3).map((am, i) => (
            <span key={i} style={{ fontSize: '10px', background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '50px', fontWeight: 700 }}>
              {am.trim()}
            </span>
          )) : <span style={{ fontSize: '10px', color: '#cbd5e1' }}>Standard Amenities</span>}
          {room.amenities?.split(',').length > 3 && <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>+{room.amenities.split(',').length - 3} more</span>}
        </div>
        <div className="fr-card-host-footer" style={{ marginTop:'14px', paddingTop:'12px', borderTop:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:10 }}>
          {room.host_name && (
            <>
              <div style={{ width:28, height:28, background:'linear-gradient(135deg,#6366f1,#a855f7)', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:800 }}>{room.host_name?.charAt(0)}</div>
              <div style={{ display:'flex', flexDirection:'column' }}>
                <span style={{ fontSize:'9px', color:'#94a3b8', fontWeight:700, textTransform:'uppercase' }}>Host</span>
                <span style={{ fontSize:'12px', color:'#334155', fontWeight:700 }}>{room.host_name}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const ChevronLeft = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRight = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
