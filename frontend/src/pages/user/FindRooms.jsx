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
            <div className="fr-card-modern" key={room.room_id}>
              <div className="fr-card-img-wrap-modern" onClick={() => openDetailModal(room)} style={{ cursor: 'pointer' }}>
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

    </div>
  );
}
