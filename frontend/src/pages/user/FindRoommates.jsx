import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FindRoommates.css";
import { calculateMatchPercentage } from "../../utils/matchUtils";
import { Search, MapPin, Wallet, User, MessageCircle, UserPlus, Users } from "lucide-react";

export default function FindRoommates() {
  const navigate = useNavigate();

  const [roommates, setRoommates] = useState([]);
  const [results, setResults] = useState([]);
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
    fetch("http://localhost:5000/api/roommates")
      .then(res => res.json())
      .then(data => {
        setRoommates(data);
        setResults(data);
      })
      .catch(err => console.error(err));
  }, []);

  const getMatch = (userPrefs) => {
    return calculateMatchPercentage(myPreferences, userPrefs || "");
  };

  const handleSearch = () => {
    const filtered = roommates.filter(user => {
      const userLocation = String(user.location || "").toLowerCase();
      const userGender = String(user.gender || "").toLowerCase();
      const userRent = (user.rent !== null && user.rent !== undefined) ? Number(user.rent) : null;

      const searchCity = city.toLowerCase();
      const searchGender = gender.toLowerCase();
      const maxBudget = budget !== "" ? Number(budget) : null;

      const matchesCity = city === "" || userLocation.includes(searchCity);
      const matchesGender = gender === "" || userGender === searchGender;
      const matchesBudget = maxBudget === null || (userRent !== null && userRent <= maxBudget);

      return matchesCity && matchesGender && matchesBudget;
    });

    setResults(filtered);
  };

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
          <h2 className="rm-title">Find Your Perfect Roommate</h2>
          <p className="rm-subtitle">Discover and connect with like-minded people.</p>
        </header>

        {/* Search Box */}
        <div className="rm-search-box glass-panel">
          <div className="rm-input-group">
            <MapPin size={18} className="rm-input-icon location-icon" />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
            />
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

          <button className="rm-search-btn" onClick={handleSearch}>
            <Search size={18} />
            Search
          </button>
        </div>

        {/* Roommate Cards */}
        <div className="roommate-grid">
          {results.length === 0 && (
            <div className="no-roommates-card">
              <Users size={64} className="no-rm-icon" />
              <h2>No Roommates Found</h2>
              <p>Try adjusting your search filters to find more matches.</p>
            </div>
          )}

          {results.map((user) => {
            const match = getMatch(user.preferences || "");
            const hasSentRequest = sentRequests.includes(user.id);

            return (
              <div className="roommate-card-modern" key={user.id}>
                <div className="rm-card-header">
                  <div className="rm-avatar">
                   {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="rm-user-info">
                    <h3>{user.name}</h3>
                    <p className="city"><MapPin size={14} style={{marginRight:'4px', opacity:0.7}}/>{user.location || "Not Specified"}</p>
                  </div>
                  <div className="rm-match-badge">
                    {match}% Match
                  </div>
                </div>

                <div className="rm-card-body">
                  <div className="rm-detail">
                    <Wallet size={18} className="rm-icon budget-icon" />
                    <span>Budget: <strong>₹{user.rent || "N/A"}</strong></span>
                  </div>
                  <div className="rm-detail">
                    <User size={18} className="rm-icon gender-icon" />
                    <span>Gender: <strong>{user.gender || "Any"}</strong></span>
                  </div>
                  <div className="rm-detail">
                    <Search size={18} className="rm-icon looking-icon" />
                    <span>Looking For: <strong>{user.user_type}</strong></span>
                  </div>
                </div>

                <div className="rm-card-actions">
                  <button
                    className={`rm-btn ${acceptedIds.includes(user.id) ? 'rm-btn-chat' : 'rm-btn-disabled'}`}
                    onClick={() => {
                      if (!acceptedIds.includes(user.id)) return;
                      navigate("/dashboard/chat");
                    }}
                    title={acceptedIds.includes(user.id) ? "Chat with roommate" : "Connect first to chat"}
                  >
                    <MessageCircle size={18} />
                    <span>{acceptedIds.includes(user.id) ? 'Chat' : 'Connect to Chat'}</span>
                  </button>
                  <button
                    className={`rm-btn ${hasSentRequest ? 'rm-btn-sent' : 'rm-btn-request'}`}
                    onClick={() => !hasSentRequest && handleRequest(user.id, user.name)}
                    disabled={hasSentRequest}
                  >
                    <UserPlus size={18} />
                    <span>{hasSentRequest ? 'Sent' : 'Request'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
