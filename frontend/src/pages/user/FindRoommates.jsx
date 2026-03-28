import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FindRoommates.css";
import { calculateMatchPercentage } from "../../utils/matchUtils";
import { Search, MapPin, Wallet, User, MessageCircle, UserPlus, Users, Home } from "lucide-react";

export default function FindRoommates() {
  const navigate = useNavigate();

  const [roommates, setRoommates] = useState([]);
  const [results, setResults] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchType, setSearchType] = useState("roommates"); // 'roommates' or 'rooms'
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");
  const [myPreferences, setMyPreferences] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [acceptedIds, setAcceptedIds] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5000/api/preferences/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.preferences) {
          const prefs = data.preferences.split(",").map(p => p.trim());
          setMyPreferences(prefs);
        }
      })
      .catch(err => console.error(err));

    // Fetch requests sent by current user
    fetch(`http://localhost:5000/api/requests/sent/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSentRequests(data.sentRequests);
        }
      })
      .catch(err => console.error("Error fetching sent requests:", err));

    // Fetch accepted connection IDs
    fetch(`http://localhost:5000/api/requests/accepted-ids/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAcceptedIds(data.acceptedIds);
        }
      })
      .catch(err => console.error("Error fetching accepted IDs:", err));
  }, []);

  useEffect(() => {
    setResults([]); // Reset view while fetching new results
    fetch("http://localhost:5000/api/roommates")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Check if data is an array (success) or an error object
        if (Array.isArray(data)) {
          setRoommates(data);
          if (searchType === "roommates") setResults(data);
        } else if (data.message) {
          console.error("API Error:", data.message);
          setRoommates([]);
          if (searchType === "roommates") setResults([]);
        } else {
          console.error("Unexpected response format:", data);
          setRoommates([]);
          if (searchType === "roommates") setResults([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setRoommates([]);
        if (searchType === "roommates") setResults([]);
      });

    fetch("http://localhost:5000/api/rooms")
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setRooms(data.rooms);
          if (searchType === "rooms") setResults(data.rooms);
        }
      })
      .catch(err => {
        console.error("Fetch Rooms Error:", err);
      });
  }, [searchType]);

  const getMatch = (userPrefs) => {
    return calculateMatchPercentage(myPreferences, userPrefs || "");
  };

  useEffect(() => {
    const listToFilter = searchType === "roommates" ? roommates : rooms;

    const filtered = listToFilter.filter(item => {
      const itemLocation = String(item.location || "").toLowerCase();
      const searchCity = city.toLowerCase();
      const matchesCity = city === "" || itemLocation.includes(searchCity);

      if (searchType === "roommates") {
        const userGender = String(item.gender || "").toLowerCase();
        const userRent = (item.rent !== null && item.rent !== undefined) ? Number(item.rent) : null;
        const searchGender = gender.toLowerCase();
        const maxBudget = budget !== "" ? Number(budget) : null;

        const matchesGender = gender === "" || userGender === searchGender;
        const matchesBudget = maxBudget === null || (userRent !== null && userRent <= maxBudget);
        return matchesCity && matchesGender && matchesBudget;
      } else {
        // Rooms filtering
        const roomRent = Number(item.rent);
        const maxBudget = budget !== "" ? Number(budget) : null;
        const matchesBudget = maxBudget === null || roomRent <= maxBudget;
        return matchesCity && matchesBudget;
      }
    });

    setResults(filtered);
  }, [city, gender, budget, roommates, rooms, searchType]);

  const handleRequest = async (receiverId, name) => {
    try {
      const senderId = localStorage.getItem("userId");
      if (!senderId) {
        setToastMessage("Please login first!");
        setTimeout(() => setToastMessage(""), 3000);
        return;
      }
      
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId })
      });
      const data = await res.json();
      
      if (data.success) {
        setToastMessage(`Roommate request sent to ${name} ✅`);
        setSentRequests(prev => [...prev, receiverId]);
      } else {
        setToastMessage(data.message || "Failed to send request");
      }
    } catch (err) {
      setToastMessage("Error sending request");
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="roommate-page">
      {/* Dynamic Background Elements */}
      <div className="rm-bg-shape rm-shape-1"></div>
      <div className="rm-bg-shape rm-shape-2"></div>

      {toastMessage && (
        <div className="custom-toast glass-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="roommate-container">
        <header className="rm-header">
          <h2 className="rm-title">{searchType === 'roommates' ? 'Find Your Perfect Roommate' : 'Find Your Perfect Room'}</h2>
          <p className="rm-subtitle">
            {searchType === 'roommates' 
              ? 'Discover and connect with like-minded people.' 
              : 'Browse available listings and find your next space.'}
          </p>
        </header>

        {/* Toggle Switch */}
        <div className="search-type-toggle">
            <button 
                className={`toggle-btn ${searchType === 'roommates' ? 'active' : ''}`}
                onClick={() => setSearchType('roommates')}
            >
                <Users size={18} /> Roommates
            </button>
            <button 
                className={`toggle-btn ${searchType === 'rooms' ? 'active' : ''}`}
                onClick={() => setSearchType('rooms')}
            >
                <Home size={18} /> Rooms
            </button>
        </div>

        {/* Search Box */}
        <div className="rm-search-box glass-panel">
          <div className="rm-input-group">
            <MapPin size={18} className="rm-input-icon location-icon" />
            <select
              value={city}
              onChange={(e)=>setCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {[...new Set(roommates.map(user => user.location).filter(Boolean))].sort().map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="rm-input-group">
            <Wallet size={18} className="rm-input-icon budget-icon" />
            <input
              type="number"
              placeholder="Max Budget"
              value={budget}
              onChange={(e)=>setBudget(e.target.value)}
            />
          </div>

          <div className="rm-input-group">
            <User size={18} className="rm-input-icon gender-icon" />
            <select
              value={gender}
              onChange={(e)=>setGender(e.target.value)}
            >
              <option value="">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button className="rm-search-btn">
            <Search size={18} />
            Search
          </button>
        </div>

        {/* Roommate Cards */}
        <div className="roommate-grid">
          {results.length === 0 && (
            <div className="no-roommates-card">
              {searchType === 'roommates' ? <Users size={64} className="no-rm-icon" /> : <Home size={64} className="no-rm-icon" />}
              <h2>No {searchType === 'roommates' ? 'Roommates' : 'Rooms'} Found</h2>
              <p>Try adjusting your search filters to find more matches.</p>
            </div>
          )}

          {results.map((item) => {
            if (searchType === "roommates") {
                const match = getMatch(item.preferences || "");
                const hasSentRequest = sentRequests.includes(item.id);

                return (
                <div className="roommate-card-modern" key={item.id}>
                    <div className="rm-card-header">
                    <div className="rm-avatar">
                    {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="rm-user-info">
                        <h3>{item.name}</h3>
                        <p className="city"><MapPin size={14} style={{marginRight:'4px', opacity:0.7}}/>{item.location || "Not Specified"}</p>
                    </div>
                    <div className="rm-match-badge">
                        {match}% Match
                    </div>
                    </div>

                    <div className="rm-card-body">
                    <div className="rm-detail">
                        <Wallet size={18} className="rm-icon budget-icon" />
                        <span>Budget: <strong>₹{item.rent || "N/A"}</strong></span>
                    </div>
                    <div className="rm-detail">
                        <User size={18} className="rm-icon gender-icon" />
                        <span>Gender: <strong>{item.gender || "Any"}</strong></span>
                    </div>
                    <div className="rm-detail">
                        <Search size={18} className="rm-icon looking-icon" />
                        <span>Looking For: <strong>{item.user_type}</strong></span>
                    </div>
                    </div>

                    <div className="rm-card-actions">
                    <button
                        className={`rm-btn ${acceptedIds.includes(item.id) ? 'rm-btn-chat' : 'rm-btn-disabled'}`}
                        onClick={() => {
                        if (!acceptedIds.includes(item.id)) return;
                        navigate("/dashboard/chat", { state: { selectedUserId: item.id } });
                        }}
                        title={acceptedIds.includes(item.id) ? "Chat with roommate" : "Connect first to chat"}
                    >
                        <MessageCircle size={18} />
                        <span>{acceptedIds.includes(item.id) ? 'Chat' : 'Connect to Chat'}</span>
                    </button>
                    <button
                        className={`rm-btn ${hasSentRequest ? 'rm-btn-sent' : 'rm-btn-request'}`}
                        onClick={() => !hasSentRequest && handleRequest(item.id, item.name)}
                        disabled={hasSentRequest}
                    >
                        <UserPlus size={18} />
                        <span>{hasSentRequest ? 'Sent' : 'Request'}</span>
                    </button>
                    </div>
                </div>
                );
            } else {
                // Room Card Implementation for Finder
                return (
                    <div className="room-card-modern" key={item.room_id}>
                        <div className="room-img-container">
                            {item.image_url ? (
                                <img src={`http://localhost:5000${item.image_url}`} alt="Room" className="room-img" />
                            ) : (
                                <div className="room-img-placeholder">Roomify</div>
                            )}
                            <div className="room-rent-tag">₹{item.rent}</div>
                        </div>
                        <div className="room-card-body">
                            <h3>Room in {item.location?.split(',')[0] || "Unknown Location"}</h3>
                            <div className="room-loc">
                                <MapPin size={14} /> {item.location}
                            </div>
                            <div className="host-info">
                                <div className="host-avatar">{item.host_name?.charAt(0) || "U"}</div>
                                <span>Host: {item.host_name || "Unknown"}</span>
                            </div>
                        </div>
                        <div className="room-card-footer">
                            <button className="room-btn-contact" onClick={() => navigate("/dashboard/chat")}>
                                <MessageCircle size={16} /> Contact Host
                            </button>
                        </div>
                    </div>
                );
            }
          })}
        </div>
      </div>
    </div>
  );
}
