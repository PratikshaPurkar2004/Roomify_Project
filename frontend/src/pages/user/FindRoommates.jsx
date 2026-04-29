import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FindRoommates.css";
// Re-using FindRooms styles for the modal
import "../../styles/FindRooms.css";
import { calculateMatchPercentage } from "../../utils/matchUtils";
import { Search, MapPin, Wallet, User, MessageCircle, UserPlus, Star, Filter, Plus, Home, X } from "lucide-react";

export default function FindRoommates() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [roommates, setRoommates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");
  const [myPreferences, setMyPreferences] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [acceptedIds, setAcceptedIds] = useState([]);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const [hostRooms, setHostRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Add Room Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    location: "",
    address: "",
    state: "",
    country: "",
    rent: "",
    max_tenants: "",
    required_tenants: "",
    property_type: "Stand Alone Building",
    furnishing: "Unfurnished",
    amenities: "",
    images: []
  });
  const [dbCities, setDbCities] = useState([]);
  const [dbStates, setDbStates] = useState([]);
  const [dbCountries, setDbCountries] = useState([]);
  const featureAmenities = ["WiFi", "AC", "TV", "Washing Machine", "Geyser", "Fridge", "Water Purifier", "Maid", "Gym", "Parking", "Lift", "Power Backup"];
  const ruleAmenities = ["No Smoking", "No Pets", "Veg Only", "Late Entry Allowed", "No Parties"];
  const prefAmenities = ["Boys Only", "Girls Only", "Family Only", "Couples Allowed"];

  const fetchHostRooms = () => {
    if (!userId) return;
    setLoadingRooms(true);
    fetch(`http://localhost:5000/api/rooms/host/${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setHostRooms(d.rooms);
        setLoadingRooms(false);
      })
      .catch(() => setLoadingRooms(false));
  };

  // Fetch initial data
  useEffect(() => {
    if (!userId) return;

    fetch("http://localhost:5000/api/cities/all")
      .then(r => r.json())
      .then(d => { if (d.success) setAllCities(d.cities); });

    // Fetch full profile for matching (City, Budget, Prefs)
    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d) {
          setMyProfile(d);
          if (d.preferences && d.preferences !== "skipped") {
            setMyPreferences(d.preferences.split(",").map(p => p.trim()).filter(Boolean));
          }
        }
      });

    fetch(`http://localhost:5000/api/requests/sent/${userId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setSentRequests(d.sentRequests); });

    fetch(`http://localhost:5000/api/requests/accepted-ids/${userId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setAcceptedIds(d.acceptedIds); });

    fetchHostRooms();

    // Fetch cities/states/countries for the modal
    fetch("http://localhost:5000/api/cities?all=true")
      .then(r => r.json())
      .then(d => { if (d.success) setDbCities(d.cities); });

    fetch("http://localhost:5000/api/cities/states")
      .then(r => r.json())
      .then(d => { if (d.success) setDbStates(d.states); });

    fetch("http://localhost:5000/api/cities/countries")
      .then(r => r.json())
      .then(d => { if (d.success) setDbCountries(d.countries); });
  }, [userId]);

  // Fetch roommates
  useEffect(() => {
    fetch("http://localhost:5000/api/roommates")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter out current user from the list
          const othersList = data.filter(u => String(u.id) !== String(userId));
          setRoommates(othersList);
          setFiltered(othersList);
        }
      })
      .catch(() => { setRoommates([]); setFiltered([]); });
  }, []);

  // Filter & Sort
  useEffect(() => {
    console.log("Matching Debug - Current User:", myProfile);
    let result = roommates.map(u => ({
      ...u,
      matchPercentage: calculateMatchPercentage(myProfile || { preferences: myPreferences }, u)
    }));

    if (city) result = result.filter(u => String(u.location || "").toLowerCase().includes(city.toLowerCase()));
    if (budget) result = result.filter(u => u.rent == null || Number(u.rent) <= Number(budget));
    if (gender) result = result.filter(u => String(u.gender || "").toLowerCase() === gender.toLowerCase());
    
    // Sorting by Match Percentage Descending
    result.sort((a, b) => b.matchPercentage - a.matchPercentage);

    setFiltered(result);
  }, [city, budget, gender, roommates, myPreferences, myProfile]);

  const showGate = !hasInteracted && hostRooms.length === 0;

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
        showToast("Room added successfully! 🎉");
        setShowAddModal(false);
        setNewRoom({ location: "", address: "", state: "", country: "", rent: "", max_tenants: "", required_tenants: "", property_type: "Stand Alone Building", furnishing: "Unfurnished", amenities: "", images: [] });
        fetchHostRooms();
        setHasInteracted(true); // Reveal roommates after adding
      } else {
        showToast(data.message || "Failed to add room");
      }
    } catch {
      showToast("Error adding room");
    }
  };

  const getMatch = (prefs) => calculateMatchPercentage(myPreferences, prefs || "");

  const handleRequest = async (receiverId, name) => {
    if (!userId) { showToast("Please login first!"); return; }
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: userId, receiver_id: receiverId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Request sent to ${name} ✅`);
        setSentRequests(prev => [...prev, receiverId]);
      } else {
        showToast(data.message || "Failed to send request");
      }
    } catch {
      showToast("Error sending request");
    }
  };

  const getMatchColor = (match) => {
    if (match >= 70) return "#10b981";
    if (match >= 40) return "#f59e0b";
    return "#94a3b8";
  };



  return (
    <div className="rm2-page">
      <div className="rm2-blob rm2-blob-1" />
      <div className="rm2-blob rm2-blob-2" />
      <div className="rm2-blob rm2-blob-3" />

      {toast && <div className="rm2-toast">{toast}</div>}

      {loadingRooms ? (
        <div style={{ textAlign: "center", marginTop: "100px", color: "#64748b" }}>
           Loading your discovery feed...
        </div>
      ) : showGate ? (
        <div className="rm2-gated-section">
          <div className="rm2-gated-card">
            <div className="rm2-gated-icon">
              <Star size={44} fill="#a855f7" color="#a855f7" />
            </div>
            <span className="rm2-badge-alt">Community Discovery</span>
            <h2>Have you added any property yet?</h2>
            <p>
              Listing your room first helps potential roommates find you easily and improves your trust score in the community.
            </p>
            <div className="rm2-gated-actions">
              <button className="rm2-primary-btn" onClick={() => setShowAddModal(true)}>
                Add Your Property Now
              </button>

            </div>
            {hostRooms.length > 0 && (
              <div className="rm2-success-mini">
                ✓ You already have {hostRooms.length} room(s) listed!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ animation: 'rm2fadeIn 0.5s ease' }}>
          {/* Filter Bar */}
          <div className="rm2-filter-bar">
            <div className="rm2-filter-label"><Filter size={16} /> Filters</div>
            <div className="rm2-filter-group">
              <MapPin size={15} className="rm2-filter-icon" />
              <select value={city} onChange={e => setCity(e.target.value)}>
                <option value="">All Cities</option>
                {allCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="rm2-filter-group">
              <Wallet size={15} className="rm2-filter-icon" />
              <input
                type="number"
                placeholder="Max Budget (₹)"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                step="100"
                min="0"
              />
            </div>
            <div className="rm2-filter-group">
              <User size={15} className="rm2-filter-icon" />
              <select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <button className="rm2-search-btn">
              <Search size={16} /> Search
            </button>
          </div>

          <div className="rm2-grid" key={myProfile ? 'loaded' : 'loading'}>
            {filtered.length === 0 ? (
              <div className="rm2-empty">
                <User size={60} />
                <h3>No Roommates Found</h3>
                <p>Try adjusting your search filters.</p>
              </div>
            ) : (
              filtered.map(person => {
                const match    = person.matchPercentage;
                const hasSent  = sentRequests.includes(person.id);
                const accepted = acceptedIds.includes(person.id);
                const matchColor = getMatchColor(match);
                const initial  = person.name?.charAt(0)?.toUpperCase() || "?";

                return (
                  <div className="rm2-card" key={person.id}>
                    {/* Match badge */}
                    <div className="rm2-match-ring" style={{ "--mc": matchColor }}>
                      <div className="rm2-avatar-wrap">
                        <div className="rm2-avatar">{initial}</div>
                      </div>
                      <span className="rm2-match-label" style={{ color: matchColor, fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {match}% Match
                      </span>
                    </div>

                    <div className="rm2-card-info-modern">
                      <div className="rm2-card-row">
                        <span className="rm2-card-label">Name</span>
                        <span className="rm2-card-value rm2-font-bold">{person.name}</span>
                      </div>
                      {person.age && (
                        <div className="rm2-card-row">
                          <span className="rm2-card-label">Age</span>
                          <span className="rm2-card-value">{person.age}</span>
                        </div>
                      )}
                      {person.occupation && (
                        <div className="rm2-card-row">
                          <span className="rm2-card-label">Occupation</span>
                          <span className="rm2-card-value">{person.occupation}</span>
                        </div>
                      )}
                      <div className="rm2-card-row">
                        <span className="rm2-card-label">Location</span>
                        <span className="rm2-card-value">{person.location || "Not specified"}</span>
                      </div>
                      <div className="rm2-card-row">
                        <span className="rm2-card-label">Gender</span>
                        <span className="rm2-card-value">{person.gender || "Any"}</span>
                      </div>
                      <div className="rm2-card-row">
                        <span className="rm2-card-label">Rent Budget</span>
                        <span className="rm2-card-value rm2-text-green">
                          {person.rent ? `₹${Number(person.rent).toLocaleString()}` : "N/A"}
                        </span>
                      </div>

                      {person.preferences && person.preferences !== "skipped" && (
                        <div className="rm2-pref-section">
                          <span className="rm2-pref-title">Preferences</span>
                          <div className="rm2-pref-tags">
                            {person.preferences.split(",").filter(Boolean).slice(0, 5).map((pref, i) => {
                              const isMatch = myPreferences.some(p => p.toLowerCase() === pref.trim().toLowerCase());
                              return (
                                <span key={i} className={`rm2-pref-tag ${isMatch ? "rm2-pref-match" : ""}`}>
                                  {pref.trim()}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rm2-card-actions">
                      <button
                        className={`rm2-action-btn ${accepted ? "rm2-btn-chat" : "rm2-btn-locked"}`}
                        onClick={() => accepted && navigate("/dashboard/chat", { state: { selectedUserId: person.id } })}
                        title={accepted ? "Chat" : "Connect first to chat"}
                      >
                        <MessageCircle size={15} />
                        {accepted ? "Chat" : "Chat"}
                      </button>

                      <button
                        className={`rm2-action-btn ${hasSent ? "rm2-btn-sent" : "rm2-btn-request"}`}
                        disabled={hasSent}
                        onClick={() => !hasSent && handleRequest(person.id, person.name)}
                      >
                        <UserPlus size={15} />
                        {hasSent ? "Sent" : "Request"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Add Room Modal - Reused from FindRooms */}
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
                  <label>Property Type *</label>
                  <select required value={newRoom.property_type} onChange={e => setNewRoom({ ...newRoom, property_type: e.target.value })}>
                    <option value="Stand Alone Building">Stand Alone Building</option>
                    <option value="Flat/Apartment">Flat/Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Bungalow / Villa">Bungalow / Villa</option>
                    <option value="PG / Hostel">PG / Hostel</option>
                    <option value="Gated Society">Gated Society</option>
                  </select>
                </div>
              </div>

              <div className="fr-form-row">
                <div className="fr-form-group" style={{ width: '100%' }}>
                  <label>Furnishing</label>
                  <select value={newRoom.furnishing} onChange={e => setNewRoom({ ...newRoom, furnishing: e.target.value })}>
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Fully-Furnished</option>
                  </select>
                </div>
              </div>

              <div className="fr-form-group">
                <label>Amenities & Features</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', marginBottom: '16px' }}>
                  {featureAmenities.map(am => {
                    const isSelected = newRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = newRoom.amenities ? newRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setNewRoom({...newRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '7px 15px', border: '1px solid #e2e8f0', borderRadius: '50px', fontSize: '13px', fontWeight: 500, color: isSelected ? '#7c3aed' : '#64748b', background: isSelected ? '#f5f3ff' : 'white', border: isSelected ? '1px solid #7c3aed' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>

                <label>House Rules</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', marginBottom: '16px' }}>
                  {ruleAmenities.map(am => {
                    const isSelected = newRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = newRoom.amenities ? newRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setNewRoom({...newRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '7px 15px', border: '1px solid #e2e8f0', borderRadius: '50px', fontSize: '13px', fontWeight: 500, color: isSelected ? '#ef4444' : '#64748b', background: isSelected ? '#fef2f2' : 'white', border: isSelected ? '1px solid #ef4444' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>

                <label>Tenant Preferences</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', marginBottom: '16px' }}>
                  {prefAmenities.map(am => {
                    const isSelected = newRoom.amenities?.includes(am);
                    return (
                      <span key={am} onClick={() => {
                        let arr = newRoom.amenities ? newRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        if (isSelected) arr = arr.filter(a => a !== am); else arr.push(am);
                        setNewRoom({...newRoom, amenities: arr.join(', ')});
                      }}
                      style={{ padding: '7px 15px', border: '1px solid #e2e8f0', borderRadius: '50px', fontSize: '13px', fontWeight: 500, color: isSelected ? '#10b981' : '#64748b', background: isSelected ? '#ecfdf5' : 'white', border: isSelected ? '1px solid #10b981' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}>
                        {am}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="fr-form-group">
                <label>Room Photos (Max 5)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  style={{ fontSize: '13px', color: '#64748b' }}
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    const currentImages = newRoom.images || [];
                    if (currentImages.length + newFiles.length > 5) {
                      showToast("Maximum 5 images allowed in total! ⚠️");
                      e.target.value = "";
                      return;
                    }
                    setNewRoom({...newRoom, images: [...currentImages, ...newFiles]});
                    e.target.value = "";
                  }} 
                />
                
                {/* Image Previews */}
                {newRoom.images && newRoom.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px', overflowX: 'auto', padding: '4px' }}>
                    {newRoom.images.map((file, idx) => (
                      <div key={idx} style={{ position: 'relative', minWidth: '85px', height: '85px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => setNewRoom({ ...newRoom, images: newRoom.images.filter((_, i) => i !== idx) })} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>{newRoom.images?.length || 0} of 5 photos selected</p>
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
