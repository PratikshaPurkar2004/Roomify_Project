import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Home, X, Edit, Trash2, Eye, Users, BedDouble } from "lucide-react";

export default function MyRooms() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [rooms, setRooms] = useState([]);
  const [toast, setToast] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const featureAmenities = ["WiFi", "AC", "TV", "Washing Machine", "Geyser", "Fridge", "Water Purifier", "Maid", "Gym", "Parking", "Lift", "Power Backup"];
  const ruleAmenities = ["No Smoking", "No Pets", "Veg Only", "Late Entry Allowed", "No Parties"];
  const prefAmenities = ["Boys Only", "Girls Only", "Family Only", "Couples Allowed"];
  const [dbCities, setDbCities] = useState([]);
  const [dbStates, setDbStates] = useState([]);
  const [dbCountries, setDbCountries] = useState([]);
  const [newRoom, setNewRoom] = useState({
    location: "", address: "", state: "", country: "", rent: "",
    max_tenants: "", required_tenants: "", property_type: "Flat/Apartment",
    furnishing: "Unfurnished", amenities: "", images: []
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchMyRooms = () => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/rooms/host/${userId}`)
      .then(r => r.json())
      .then(data => { if (data.success) setRooms(data.rooms || []); })
      .catch(() => setRooms([]));
  };

  useEffect(() => {
    fetchMyRooms();
    fetch("http://localhost:5000/api/cities?all=true").then(r => r.json()).then(d => { if (d.success) setDbCities(d.cities); }).catch(() => {});
    fetch("http://localhost:5000/api/cities/states").then(r => r.json()).then(d => { if (d.success) setDbStates(d.states); }).catch(() => {});
    fetch("http://localhost:5000/api/cities/countries").then(r => r.json()).then(d => { if (d.success) setDbCountries(d.countries); }).catch(() => {});
  }, [userId]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("host_id", userId);
    Object.entries(newRoom).forEach(([k, v]) => {
      if (k === "images") v.forEach(f => fd.append("images", f));
      else if (v !== null && v !== "") fd.append(k, v);
    });
    try {
      const res = await fetch("http://localhost:5000/api/rooms/add", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        showToast("Room added! 🎉"); setShowAddModal(false);
        setNewRoom({ location:"",address:"",state:"",country:"",rent:"",max_tenants:"",required_tenants:"",property_type:"Flat/Apartment",furnishing:"Unfurnished",amenities:"",images:[] });
        fetchMyRooms();
      } else showToast(data.message || "Failed");
    } catch { showToast("Error"); }
  };

  const openEditModal = (room) => {
    setEditRoom({ room_id: room.room_id, location: room.location||"", address: room.address||"", rent: room.rent||"", max_tenants: room.max_tenants||"", required_tenants: room.required_tenants||"", furnishing: room.furnishing||"Unfurnished", amenities: room.amenities||"", availability: room.availability||"available", images: [] });
    setShowEditModal(true);
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(editRoom).forEach(([k, v]) => {
      if (k === "images") v.forEach(f => fd.append("images", f));
      else fd.append(k, v);
    });
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/edit/${editRoom.room_id}`, { method: "PUT", body: fd });
      const data = await res.json();
      if (data.success) { showToast("Updated! ✏️"); setShowEditModal(false); fetchMyRooms(); }
      else showToast(data.message || "Failed");
    } catch { showToast("Error"); }
  };

  const handleDeleteRoom = (id) => {
    if (!window.confirm("Delete this room?")) return;
    fetch(`http://localhost:5000/api/rooms/delete/${id}`, { method: "DELETE" })
      .then(r => r.json()).then(data => { if (data.success) { showToast("Deleted 🗑️"); fetchMyRooms(); } });
  };

  const getImg = (room) => {
    try { const a = JSON.parse(room.image_url); return Array.isArray(a) && a.length ? `http://localhost:5000${a[0]}` : null; }
    catch { return room.image_url ? `http://localhost:5000${room.image_url}` : null; }
  };

  return (
    <div className="mr-page">
      <style>{`
        .mr-page { padding: 40px; background: #f8fafc; min-height: 100vh; font-family: 'Segoe UI', sans-serif; margin-left: 280px; }
        .mr-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .mr-topbar h1 { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0; }
        .mr-topbar p { color: #64748b; margin: 4px 0 0; font-size: 15px; }
        .mr-add-btn { display: flex; align-items: center; gap: 8px; background: #4f46e5; color: white; border: none; padding: 13px 24px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .mr-add-btn:hover { background: #4338ca; }
        .mr-stats { display: flex; gap: 16px; margin-bottom: 32px; }
        .mr-stat { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 24px; flex: 1; }
        .mr-stat-num { font-size: 28px; font-weight: 900; margin: 0; }
        .mr-stat-label { font-size: 13px; color: #64748b; font-weight: 600; margin: 4px 0 0; }
        .mr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .mr-card { background: white; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; transition: all 0.25s; }
        .mr-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: #6366f1; }
        .mr-img { height: 200px; position: relative; background: #f1f5f9; overflow: hidden; cursor: pointer; }
        .mr-img img { width: 100%; height: 100%; object-fit: cover; }
        .mr-img-ph { height: 100%; display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
        .mr-avail { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .mr-avail.available { background: #dcfce7; color: #15803d; }
        .mr-avail.booked { background: #fee2e2; color: #dc2626; }
        .mr-price-tag { position: absolute; bottom: 12px; right: 12px; background: rgba(15,23,42,0.8); color: white; padding: 6px 12px; border-radius: 10px; font-size: 16px; font-weight: 800; backdrop-filter: blur(4px); }
        .mr-btns { position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; }
        .mr-icon-btn { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.9); transition: all 0.2s; }
        .mr-icon-btn:hover { transform: scale(1.1); }
        .mr-body { padding: 18px 20px; }
        .mr-body h3 { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
        .mr-loc { display: flex; align-items: center; gap: 5px; color: #64748b; font-size: 13px; margin-bottom: 14px; }
        .mr-meta { display: flex; gap: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9; }
        .mr-meta-item { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #475569; font-weight: 600; }
        .mr-empty { text-align: center; padding: 80px 20px; background: white; border-radius: 20px; border: 2px dashed #e2e8f0; grid-column: 1/-1; }
        .mr-toast { position: fixed; bottom: 28px; right: 28px; background: #1e293b; color: white; padding: 14px 24px; border-radius: 12px; font-weight: 700; z-index: 9999; font-size: 15px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .mr-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(3px); }
        .mr-modal { background: white; border-radius: 24px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.2); }
        .mr-modal-head { padding: 24px 28px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .mr-modal-head h3 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
        .mr-modal-body { padding: 24px 28px; }
        .mr-helper { font-size: 11.5px; color: #16a34a; font-weight: 700; margin-top: 4px; display: inline-block; }
      `}</style>

      {toast && <div className="mr-toast">{toast}</div>}

      <div className="mr-topbar" style={{ justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="mr-add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> Add New Room
        </button>
      </div>

      <div className="fr-grid">
        {rooms.length === 0 ? (
          <div className="mr-empty">
            <Home size={56} color="#cbd5e1" />
            <h3 style={{marginTop:'16px',fontWeight:800,color:'#1e293b'}}>No rooms listed yet</h3>
            <p style={{color:'#64748b',marginBottom:'20px'}}>Click "Add New Room" to post your first listing.</p>
            <button className="mr-add-btn" style={{margin:'0 auto'}} onClick={() => setShowAddModal(true)}><Plus size={18} /> Add Room</button>
          </div>
        ) : rooms.map(room => {
          const img = getImg(room);
          return (
            <div className="fr-card-modern" key={room.room_id}>
              <div className="fr-card-img-wrap-modern" onClick={() => navigate(`/dashboard/room-details/${room.room_id}`)} style={{ cursor: 'pointer' }}>
                {img ? <img src={img} alt="Room" /> : <div className="fr-card-img-placeholder-modern"><Home size={40} /></div>}
                
                <div className="fr-card-badges">
                  <span className={`fr-badge-modern ${room.availability}`}>
                    {room.availability === "available" ? "✓ AVAILABLE" : "BOOKED"}
                  </span>
                  <span className="fr-property-type-badge">{room.property_type || "Standard"}</span>
                </div>
                
                <div className="fr-rent-tag-modern">
                  ₹{Number(room.rent).toLocaleString()}<span>/mo pp</span>
                </div>

                <div className="mr-btns" onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
                  <button className="mr-icon-btn" title="View" onClick={() => navigate(`/dashboard/room-details/${room.room_id}`)}><Eye size={14} color="#6366f1" /></button>
                  <button className="mr-icon-btn" title="Edit" onClick={() => openEditModal(room)}><Edit size={14} color="#f59e0b" /></button>
                  <button className="mr-icon-btn" title="Delete" onClick={() => handleDeleteRoom(room.room_id)}><Trash2 size={14} color="#ef4444" /></button>
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
                    <span className="fr-detail-label">Monthly Rent (pp)</span>
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
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fr-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="fr-modal" onClick={e => e.stopPropagation()}>
            <div className="fr-modal-header">
              <h3>List a New Room</h3>
              <button className="fr-modal-close" style={{background:'none',border:'none',cursor:'pointer'}} onClick={() => setShowAddModal(false)}><X size={22} /></button>
            </div>
            <form className="fr-modal-form" onSubmit={handleAddRoom}>
              <div className="fr-form-row">
                <div className="fr-form-group"><label>City *</label><select required value={newRoom.location} onChange={e=>setNewRoom({...newRoom,location:e.target.value})}><option value="">Select City</option>{dbCities.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                <div className="fr-form-group"><label>State *</label><select required value={newRoom.state} onChange={e=>setNewRoom({...newRoom,state:e.target.value})}><option value="">Select State</option>{dbStates.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="fr-form-row">
                <div className="fr-form-group"><label>Country *</label><select required value={newRoom.country} onChange={e=>setNewRoom({...newRoom,country:e.target.value})}><option value="">Select Country</option>{dbCountries.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                <div className="fr-form-group"><label>Address *</label><input required placeholder="Flat 101, Building Name" value={newRoom.address} onChange={e=>setNewRoom({...newRoom,address:e.target.value})} /></div>
              </div>
              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Monthly Rent (Per Person) *</label>
                  <input required type="number" placeholder="8000" value={newRoom.rent} onChange={e=>setNewRoom({...newRoom,rent:e.target.value})} />
                </div>
                <div className="fr-form-group">
                  <label>Total Tenants *</label>
                  <input required type="number" placeholder="3" value={newRoom.max_tenants} onChange={e=>setNewRoom({...newRoom,max_tenants:e.target.value})} />
                </div>
              </div>
              <div className="fr-form-row">
                <div className="fr-form-group"><label>Required Tenants *</label><input required type="number" placeholder="1" value={newRoom.required_tenants} onChange={e=>setNewRoom({...newRoom,required_tenants:e.target.value})} /></div>
                <div className="fr-form-group"><label>Property Type</label><select value={newRoom.property_type} onChange={e=>setNewRoom({...newRoom,property_type:e.target.value})}><option>Flat/Apartment</option><option>Independent House</option><option>Bungalow / Villa</option><option>PG / Hostel</option></select></div>
              </div>
              <div className="fr-form-row">
                <div className="fr-form-group"><label>Furnishing</label><select value={newRoom.furnishing} onChange={e=>setNewRoom({...newRoom,furnishing:e.target.value})}><option>Unfurnished</option><option>Semi-Furnished</option><option>Fully-Furnished</option></select></div>
              </div>
              <div className="fr-form-group">
                <label>Amenities & Features</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', marginBottom: '16px' }}>
                  {featureAmenities.map(am => {
                    const isSelected = newRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = newRoom.amenities ? newRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setNewRoom({...newRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '6px 12px', border: isSelected ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: isSelected ? '#4f46e5' : '#64748b', background: isSelected ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>

                <label>House Rules</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', marginBottom: '16px' }}>
                  {ruleAmenities.map(am => {
                    const isSelected = newRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = newRoom.amenities ? newRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setNewRoom({...newRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '6px 12px', border: isSelected ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: isSelected ? '#dc2626' : '#64748b', background: isSelected ? '#fef2f2' : 'white', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>

                <label>Tenant Preferences</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', marginBottom: '8px' }}>
                  {prefAmenities.map(am => {
                    const isSelected = newRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = newRoom.amenities ? newRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setNewRoom({...newRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '6px 12px', border: isSelected ? '1.5px solid #10b981' : '1.5px solid #e2e8f0', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: isSelected ? '#059669' : '#64748b', background: isSelected ? '#ecfdf5' : 'white', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div className="fr-form-group">
                <label>Room Photos (Max 5)</label><input type="file" accept="image/*" multiple onChange={e=>setNewRoom({...newRoom,images:Array.from(e.target.files)})} />
              </div>
              
              <div className="fr-modal-actions">
                <button type="button" className="fr-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="fr-modal-submit">Post Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editRoom && (
        <div className="fr-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="fr-modal" onClick={e => e.stopPropagation()}>
            <div className="fr-modal-header">
              <h3>Edit Room</h3>
              <button className="fr-modal-close" style={{background:'none',border:'none',cursor:'pointer'}} onClick={() => setShowEditModal(false)}><X size={22} /></button>
            </div>
            <form className="fr-modal-form" onSubmit={handleEditRoom}>
              <div className="fr-form-row">
                <div className="fr-form-group"><label>City *</label><select required value={editRoom.location} onChange={e=>setEditRoom({...editRoom,location:e.target.value})}><option value="">Select City</option>{dbCities.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                <div className="fr-form-group"><label>Address *</label><input required placeholder="Flat 101, Building Name" value={editRoom.address} onChange={e=>setEditRoom({...editRoom,address:e.target.value})} /></div>
              </div>
              <div className="fr-form-row">
                <div className="fr-form-group">
                  <label>Monthly Rent (Per Person) *</label>
                  <input required type="number" value={editRoom.rent} onChange={e=>setEditRoom({...editRoom,rent:e.target.value})} />
                </div>
                <div className="fr-form-group">
                  <label>Total Tenants *</label>
                  <input required type="number" value={editRoom.max_tenants} onChange={e=>setEditRoom({...editRoom,max_tenants:e.target.value})} />
                </div>
              </div>
              <div className="fr-form-row">
                <div className="fr-form-group"><label>Furnishing</label><select value={editRoom.furnishing} onChange={e=>setEditRoom({...editRoom,furnishing:e.target.value})}><option>Unfurnished</option><option>Semi-Furnished</option><option>Fully-Furnished</option></select></div>
                <div className="fr-form-group"><label>Availability</label><select value={editRoom.availability} onChange={e=>setEditRoom({...editRoom,availability:e.target.value})}><option value="available">Available</option><option value="booked">Booked</option></select></div>
              </div>
              <div className="fr-form-group">
                <label>Amenities & Features</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', marginBottom: '16px' }}>
                  {featureAmenities.map(am => {
                    const isSelected = editRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = editRoom.amenities ? editRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setEditRoom({...editRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '6px 12px', border: isSelected ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: isSelected ? '#4f46e5' : '#64748b', background: isSelected ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>

                <label>House Rules</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', marginBottom: '16px' }}>
                  {ruleAmenities.map(am => {
                    const isSelected = editRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = editRoom.amenities ? editRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setEditRoom({...editRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '6px 12px', border: isSelected ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: isSelected ? '#dc2626' : '#64748b', background: isSelected ? '#fef2f2' : 'white', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>

                <label>Tenant Preferences</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', marginBottom: '8px' }}>
                  {prefAmenities.map(am => {
                    const isSelected = editRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = editRoom.amenities ? editRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setEditRoom({...editRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '6px 12px', border: isSelected ? '1.5px solid #10b981' : '1.5px solid #e2e8f0', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: isSelected ? '#059669' : '#64748b', background: isSelected ? '#ecfdf5' : 'white', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div className="fr-form-group">
                <label>Replace Photos (optional)</label><input type="file" accept="image/*" multiple onChange={e=>setEditRoom({...editRoom,images:Array.from(e.target.files)})} />
              </div>
              
              <div className="fr-modal-actions">
                <button type="button" className="fr-modal-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="fr-modal-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
