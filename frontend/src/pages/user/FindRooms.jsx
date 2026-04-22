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


  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const prevImg = (images) => {
    setActiveImgIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImg = (images) => {
    setActiveImgIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/cities?all=true")
      .then(r => r.json())
      .then(d => { if (d.success) setDbCities(d.cities); });

    fetch("http://localhost:5000/api/cities/states")
      .then(r => r.json())
      .then(d => { if (d.success) setDbStates(d.states); });

    fetch("http://localhost:5000/api/cities/countries")
      .then(r => r.json())
      .then(d => { if (d.success) setDbCountries(d.countries); });
  }, []);


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
            <div className="fr-card-modern" key={room.room_id}>
              <div className="fr-card-img-wrap-modern" onClick={() => { setSelectedRoom(room); setShowDetailModal(true); }} style={{ cursor: 'pointer' }}>
                {(() => {
                  let images = [];
                  try {
                    images = JSON.parse(room.image_url);
                    if (!Array.isArray(images)) images = [room.image_url];
                  } catch {
                    images = room.image_url ? [room.image_url] : [];
                  }
                  
                  if (images.length > 0) {
                    return <img src={`http://localhost:5000${images[0]}`} alt="Room" />;
                  }
                  return <div className="fr-card-img-placeholder-modern"><Home size={40} /></div>;
                })()}


                <div className="fr-card-badges">
                  <span className={`fr-badge-modern ${room.availability}`}>
                    {room.availability === "available" ? "✓ AVAILABLE" : "BOOKED"}
                  </span>
                  <span className="fr-property-type-badge">{room.property_type || "Standard"}</span>
                </div>
                <div className="fr-rent-tag-modern">
                  ₹{Number(room.rent).toLocaleString()}<span>/mo</span>
                </div>
              </div>

              <div className="fr-card-body-modern">
                <div className="fr-card-header-modern">
                  <h3>{room.property_type || "Room"} in {room.location?.split(",")[0]}</h3>
                  <p className="fr-card-addr">
                    <MapPin size={14} /> {room.address ? `${room.address}, ` : ""}{room.location}
                  </p>
                </div>

                <div className="fr-card-details-grid">
                  <div className="fr-detail-row">
                    <span className="fr-detail-label">Monthly Rent</span>
                    <span className="fr-detail-value fr-text-price">₹{Number(room.rent).toLocaleString()}</span>
                  </div>
                  <div className="fr-detail-row">
                    <span className="fr-detail-label">Total Capacity</span>
                    <span className="fr-detail-value">{room.max_tenants || 1} People</span>
                  </div>
                  <div className="fr-detail-row">
                    <span className="fr-detail-label">Looking For</span>
                    <span className="fr-detail-value">{room.required_tenants || 1} Roommate(s)</span>
                  </div>
                  <div className="fr-detail-row">
                    <span className="fr-detail-label">Furnishing</span>
                    <span className="fr-detail-value">{room.furnishing || "Not set"}</span>
                  </div>
                </div>

                <div className="fr-amenities-section">
                   <p className="fr-section-title">Amenities</p>
                   <div className="fr-amenity-tags">
                      {room.amenities ? room.amenities.split(",").map((a, i) => (
                        <span key={i} className="fr-amenity-tag">{a.trim()}</span>
                      )) : <span className="fr-no-amenities">Basic essentials included</span>}
                   </div>
                </div>

                <div className="fr-card-host-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {room.host_name && (
                    <div className="fr-host-mini-info">
                      <div className="fr-host-avatar-sm">{room.host_name?.charAt(0)}</div>
                      <div className="fr-host-text-sm">
                        <span className="fr-host-posted">Posted by</span>
                        <span className="fr-host-name-sm">{room.host_name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Room Detail Modal */}
      {showDetailModal && selectedRoom && (
        <div className="fr-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="fr-modal fr-detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="fr-modal-header">
              <h3>Room Details</h3>
              <X size={22} className="fr-modal-close" onClick={() => setShowDetailModal(false)} />
            </div>
            
            <div className="fr-detail-content" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div className="fr-detail-visuals">
                {(() => {
                  let images = [];
                  try {
                    images = JSON.parse(selectedRoom.image_url);
                    if (!Array.isArray(images)) images = [selectedRoom.image_url];
                  } catch {
                    images = selectedRoom.image_url ? [selectedRoom.image_url] : [];
                  }

                  if (images.length === 0) {
                    return (
                      <div className="fr-detail-main-img" style={{ borderRadius: '16px', height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Home size={80} color="#cbd5e1" />
                      </div>
                    );
                  }

                  return (
                    <>
                      <div className="fr-detail-main-img" style={{ borderRadius: '16px', overflow: 'hidden', height: '300px', width: '100%', background: '#f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative' }}>
                        <img 
                          src={`http://localhost:5000${images[activeImgIndex] || images[0]}`} 
                          alt="Main" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s' }} 
                        />
                        
                        {images.length > 1 && (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); prevImg(images); }}
                              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              &#8249;
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); nextImg(images); }}
                              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              &#8250;
                            </button>
                            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', backdropFilter: 'blur(4px)' }}>
                              {activeImgIndex + 1} / {images.length}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="fr-detail-thumbnails" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '12px' }}>
                        {images.map((img, i) => (
                          <div 
                            key={i} 
                            onClick={() => setActiveImgIndex(i)}
                            style={{ 
                              height: '50px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', 
                              border: activeImgIndex === i ? '2px solid #6366f1' : '2px solid transparent',
                              transition: 'all 0.2s'
                            }}
                          >
                            <img src={`http://localhost:5000${img}`} alt={`Thumb ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}


                <div className="fr-detail-badges" style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  <span className={`fr-badge-modern ${selectedRoom.availability}`} style={{ position: 'static' }}>
                    {selectedRoom.availability === "available" ? "✓ AVAILABLE" : "BOOKED"}
                  </span>
                  <span className="fr-property-type-badge" style={{ position: 'static' }}>{selectedRoom.property_type || "Standard"}</span>
                </div>
              </div>

              <div className="fr-detail-info">
                <div className="fr-detail-header" style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 8px 0' }}>{selectedRoom.property_type || "Room"} in {selectedRoom.location?.split(",")[0]}</h2>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', margin: 0 }}>
                    <MapPin size={16} /> {selectedRoom.address ? `${selectedRoom.address}, ` : ""}{selectedRoom.location}
                  </p>
                </div>

                <div className="fr-detail-grid-compact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
                  <div className="fr-compact-item">
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Rent</span>
                    <p style={{ margin: '4px 0 0', fontWeight: 800, color: '#10b981', fontSize: '18px' }}>₹{Number(selectedRoom.rent).toLocaleString()}<small style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}> /mo</small></p>
                  </div>
                  <div className="fr-compact-item">
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Capacity</span>
                    <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#1e293b' }}>{selectedRoom.max_tenants} People</p>
                  </div>
                  <div className="fr-compact-item">
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Looking for</span>
                    <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#1e293b' }}>{selectedRoom.required_tenants} Roommate(s)</p>
                  </div>
                  <div className="fr-compact-item">
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Furnishing</span>
                    <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#1e293b' }}>{selectedRoom.furnishing || "Not set"}</p>
                  </div>
                </div>

                <div className="fr-detail-amenities" style={{ marginBottom: '20px' }}>
                  <p className="fr-section-title">Amenities</p>
                  <div className="fr-amenity-tags" style={{ marginTop: '8px' }}>
                    {selectedRoom.amenities ? selectedRoom.amenities.split(",").map((a, i) => (
                      <span key={i} className="fr-amenity-tag">{a.trim()}</span>
                    )) : <span className="fr-no-amenities">Basic essentials included</span>}
                  </div>
                </div>

                <div className="fr-detail-host" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                   <div className="fr-host-mini-info">
                     <div className="fr-host-avatar-sm">{selectedRoom.host_name?.charAt(0)}</div>
                     <div className="fr-host-text-sm">
                       <span className="fr-host-posted">Listed by</span>
                       <span className="fr-host-name-sm">{selectedRoom.host_name}</span>
                     </div>
                   </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
