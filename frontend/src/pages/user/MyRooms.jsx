import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Home, X, Edit, Trash2 } from "lucide-react";
import "../../styles/FindRooms.css"; // Reusing the same styling for consistency

export default function MyRooms() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [rooms, setRooms] = useState([]);
  const [toast, setToast] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const prevImg = (images) => {
    setActiveImgIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImg = (images) => {
    setActiveImgIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };




  const [dbCities, setDbCities] = useState([]);
  const [dbStates, setDbStates] = useState([]);
  const [dbCountries, setDbCountries] = useState([]);

  const [newRoom, setNewRoom] = useState({ 
    location: "", 
    address: "", 
    state: "", 
    country: "", 
    rent: "", 
    max_tenants: "", 
    required_tenants: "", 
    property_type: "Flat/Apartment", 
    furnishing: "Unfurnished", 
    amenities: "", 
    images: [] 
  });





  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchMyRooms = () => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/rooms/host/${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setRooms(data.rooms || []);
        }
      })
      .catch(() => setRooms([]));
  };

  useEffect(() => {
    fetchMyRooms();
    
    // Fetch helper data
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
  }, [userId]);

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
        fetchMyRooms();

      } else {
        showToast(data.message || "Failed to add room");
      }
    } catch {
      showToast("Error adding room");
    }
  };


  const openEditModal = (room) => {
    setEditRoom({
      room_id: room.room_id,
      location: room.location || "",
      address: room.address || "",
      rent: room.rent || "",
      max_tenants: room.max_tenants || "",
      required_tenants: room.required_tenants || "",
      furnishing: room.furnishing || "Unfurnished",
      amenities: room.amenities || "",
      availability: room.availability || "available",
      images: []
    });
    setShowEditModal(true);
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("location", editRoom.location);
    formData.append("address", editRoom.address);
    formData.append("rent", editRoom.rent);
    formData.append("max_tenants", editRoom.max_tenants);
    formData.append("furnishing", editRoom.furnishing);
    formData.append("amenities", editRoom.amenities);
    formData.append("availability", editRoom.availability);
    editRoom.images.forEach(file => formData.append("images", file));

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/edit/${editRoom.room_id}`, {
        method: "PUT",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showToast("Room updated successfully! ✏️");
        setShowEditModal(false);
        fetchMyRooms();
      } else {
        showToast(data.message || "Failed to update room");
      }
    } catch {
      showToast("Error updating room");
    }
  };

  const handleDeleteRoom = (roomId) => {

    if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      fetch(`http://localhost:5000/api/rooms/delete/${roomId}`, {
        method: "DELETE",
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showToast("Room deleted successfully! 🗑️");
            fetchMyRooms();
          } else {
            showToast(data.message || "Failed to delete room");
          }
        })
        .catch(() => showToast("Error deleting room"));
    }
  };

  return (
    <div className="fr-page">
      <div className="fr-blob fr-blob-1" />
      <div className="fr-blob fr-blob-2" />

      {toast && <div className="fr-toast">{toast}</div>}

      <div className="my-rooms-header">
        <div className="my-rooms-title">
          <h2>My Rooms</h2>
          <p>Manage your properties and listings</p>
        </div>
        <button className="add-room-trigger" onClick={() => setShowAddModal(true)}>
          <Plus size={22} /> Add New Room
        </button>
      </div>

      <div className="fr-grid">
        {rooms.length === 0 ? (
          <div className="fr-empty">
            <Home size={56} />
            <h3>No Rooms Added Yet</h3>
            <p>Start by adding your first property listing.</p>
            <button className="fr-add-room-btn" onClick={() => setShowAddModal(true)} style={{ marginTop: '1rem', color: '#6366f1', background: 'none', border: '1px solid #6366f1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
              Add Property
            </button>
          </div>
        ) : (
          rooms.map(room => (
            <div className="fr-card-modern" key={room.room_id}>
              <div className="fr-card-img-wrap-modern" onClick={() => { setSelectedRoom(room); setActiveImgIndex(0); setShowDetailModal(true); }} style={{ cursor: 'pointer' }}>

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
                    <span className="fr-detail-label">Rent</span>
                    <span className="fr-detail-value">₹{Number(room.rent).toLocaleString()}</span>
                  </div>
                  <div className="fr-detail-row">
                    <span className="fr-detail-label">Capacity</span>
                    <span className="fr-detail-value">{room.max_tenants} People</span>
                  </div>
                </div>

                <div className="fr-card-actions">
                  <button className="fr-edit-btn" onClick={() => openEditModal(room)}>
                    <Edit size={16} /> Edit
                  </button>
                  <button className="fr-delete-btn" onClick={() => handleDeleteRoom(room.room_id)}>
                    <Trash2 size={16} /> Delete
                  </button>
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
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Edit Room Modal */}
      {showEditModal && editRoom && (
        <div className="fr-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="fr-modal" onClick={e => e.stopPropagation()}>
            <div className="fr-modal-header">
              <h3>Edit Room Listing</h3>
              <X size={22} className="fr-modal-close" onClick={() => setShowEditModal(false)} />
            </div>
            <form onSubmit={handleEditRoom} className="fr-modal-form">
              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>City *</label>
                  <select required value={editRoom.location} onChange={e => setEditRoom({ ...editRoom, location: e.target.value })}>
                    <option value="">Select City</option>
                    {dbCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fr-form-group">
                  <label>Complete Address *</label>
                  <input required placeholder="Flat 101, Building Name" value={editRoom.address} onChange={e => setEditRoom({ ...editRoom, address: e.target.value })} />
                </div>
              </div>

              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Monthly Rent (₹) *</label>
                  <input required type="number" placeholder="Amount in ₹" value={editRoom.rent} onChange={e => setEditRoom({ ...editRoom, rent: e.target.value })} />
                </div>
                <div className="fr-form-group">
                  <label>Total Tenants *</label>
                  <input required type="number" placeholder="Max capacity" value={editRoom.max_tenants} onChange={e => setEditRoom({ ...editRoom, max_tenants: e.target.value })} />
                </div>
              </div>

              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Furnishing</label>
                  <select value={editRoom.furnishing} onChange={e => setEditRoom({ ...editRoom, furnishing: e.target.value })}>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Fully-Furnished</option>
                  </select>
                </div>
                <div className="fr-form-group">
                  <label>Availability</label>
                  <select value={editRoom.availability} onChange={e => setEditRoom({ ...editRoom, availability: e.target.value })}>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>

              <div className="fr-form-group">
                <label>Amenities</label>
                <input placeholder="WiFi, AC, Gym..." value={editRoom.amenities} onChange={e => setEditRoom({ ...editRoom, amenities: e.target.value })} />
              </div>

              <div className="fr-form-group">
                <label>Replace Photos (optional, Max 5)</label>
                <input type="file" accept="image/*" multiple onChange={e => setEditRoom({ ...editRoom, images: Array.from(e.target.files) })} />
              </div>

              <div className="fr-modal-actions">
                <button type="button" className="fr-modal-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="fr-modal-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fr-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="fr-modal" onClick={e => e.stopPropagation()}>
            <div className="fr-modal-header">
              <h3>Create Room Listing</h3>
              <X size={22} className="fr-modal-close" onClick={() => setShowAddModal(false)} />
            </div>
            <form onSubmit={handleAddRoom} className="fr-modal-form">
              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>City *</label>
                  <select required value={newRoom.location} onChange={e => setNewRoom({ ...newRoom, location: e.target.value })}>
                    <option value="">Select City</option>
                    {dbCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fr-form-group">
                  <label>State *</label>
                  <select required value={newRoom.state} onChange={e => setNewRoom({ ...newRoom, state: e.target.value })}>
                    <option value="">Select State</option>
                    {dbStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Country *</label>
                  <select required value={newRoom.country} onChange={e => setNewRoom({ ...newRoom, country: e.target.value })}>
                    <option value="">Select Country</option>
                    {dbCountries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fr-form-group">
                  <label>Complete Address *</label>
                  <input required placeholder="Flat 101, Building Name" value={newRoom.address} onChange={e => setNewRoom({ ...newRoom, address: e.target.value })} />
                </div>
              </div>

              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Total Tenants *</label>
                  <input required type="number" placeholder="Total capacity" value={newRoom.max_tenants} onChange={e => setNewRoom({ ...newRoom, max_tenants: e.target.value })} />
                </div>
                <div className="fr-form-group">
                  <label>Required Tenants *</label>
                  <input required type="number" placeholder="Looking for?" value={newRoom.required_tenants} onChange={e => setNewRoom({ ...newRoom, required_tenants: e.target.value })} />
                </div>
              </div>

              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Monthly Rent (per person) *</label>
                  <input required type="number" placeholder="Amount in ₹" value={newRoom.rent} onChange={e => setNewRoom({ ...newRoom, rent: e.target.value })} />
                </div>
                <div className="fr-form-group">
                  <select required value={newRoom.property_type} onChange={e => setNewRoom({ ...newRoom, property_type: e.target.value })}>
                    <option value="Flat/Apartment">Flat / Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Bungalow / Villa">Bungalow / Villa</option>
                    <option value="PG / Hostel">PG / Hostel</option>
                  </select>

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
                <label>Room Photos (Max 5)</label>
                <input type="file" accept="image/*" multiple onChange={e => setNewRoom({ ...newRoom, images: Array.from(e.target.files) })} />
              </div>


              <div className="fr-modal-actions">
                <button type="button" className="fr-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="fr-modal-submit">Post Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
