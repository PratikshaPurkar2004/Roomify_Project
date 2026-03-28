import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FindRoommates.css";
import { calculateMatchPercentage } from "../../utils/matchUtils";
import { Search, MapPin, Wallet, User, MessageCircle, UserPlus, Filter, Zap } from "lucide-react";

export default function FindRoommates() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [roommates, setRoommates] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [city, setCity]           = useState("");
  const [budget, setBudget]       = useState("");
  const [gender, setGender]       = useState("");
  const [myPreferences, setMyPreferences] = useState([]);
  const [sentRequests, setSentRequests]   = useState([]);
  const [acceptedIds, setAcceptedIds]     = useState([]);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/preferences/${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d?.preferences) setMyPreferences(d.preferences.split(",").map(p => p.trim()));
      });

    fetch(`http://localhost:5000/api/requests/sent/${userId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setSentRequests(d.sentRequests); });

    fetch(`http://localhost:5000/api/requests/accepted-ids/${userId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setAcceptedIds(d.acceptedIds); });
  }, [userId]);

  useEffect(() => {
    fetch("http://localhost:5000/api/roommates")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRoommates(data);
          setFiltered(data);
        }
      })
      .catch(() => { setRoommates([]); setFiltered([]); });
  }, []);

  useEffect(() => {
    let result = roommates;
    if (city) result = result.filter(u => String(u.location || "").toLowerCase().includes(city.toLowerCase()));
    if (budget) result = result.filter(u => u.rent == null || Number(u.rent) <= Number(budget));
    if (gender) result = result.filter(u => String(u.gender || "").toLowerCase() === gender.toLowerCase());
    setFiltered(result);
  }, [city, budget, gender, roommates]);

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

  const cities = [...new Set(roommates.map(u => u.location).filter(Boolean))];

  return (
    <div className="rm2-page">
      <div className="rm2-blob rm2-blob-1" />
      <div className="rm2-blob rm2-blob-2" />
      <div className="rm2-blob rm2-blob-3" />

      {toast && <div className="rm2-toast">{toast}</div>}

      <div className="rm2-hero">
        <div className="rm2-hero-content">
          <span className="rm2-hero-badge">👥 Find Roommates</span>
          <h1>Meet Your Perfect <span className="rm2-grad">Roommate</span></h1>
          <p>Connect with verified, like-minded people based on lifestyle, budget & preferences.</p>
        </div>
      </div>

      <div className="rm2-filter-bar">
        <div className="rm2-filter-label"><Filter size={16} /> Filters</div>
        <div className="rm2-filter-group">
          <MapPin size={15} className="rm2-filter-icon" />
          <select value={city} onChange={e => setCity(e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="rm2-filter-group">
          <Wallet size={15} className="rm2-filter-icon" />
          <input
            type="number"
            placeholder="Max Budget (₹)"
            value={budget}
            onChange={e => setBudget(e.target.value)}
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
      </div>

      <div className="rm2-results-label">
        {filtered.length} roommate{filtered.length !== 1 ? "s" : ""} found
      </div>

      <div className="rm2-grid">
        {filtered.length === 0 ? (
          <div className="rm2-empty">
            <User size={60} />
            <h3>No Roommates Found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        ) : (
          filtered.map(person => {
            const match    = getMatch(person.preferences);
            const hasSent  = sentRequests.includes(person.id);
            const accepted = acceptedIds.includes(person.id);
            const matchColor = getMatchColor(match);
            const initial  = person.name?.charAt(0)?.toUpperCase() || "?";

            return (
              <div className="rm2-card" key={person.id}>
                <div className="rm2-match-ring" style={{ "--mc": matchColor }}>
                  <div className="rm2-avatar-wrap">
                    <div className="rm2-avatar">{initial}</div>
                  </div>
                  <span className="rm2-match-label" style={{ color: matchColor }}>
                    {match}% match
                  </span>
                </div>

                <div className="rm2-card-info-modern">
                  <div className="rm2-card-row">
                    <span className="rm2-card-label">Name</span>
                    <span className="rm2-card-value rm2-font-bold">{person.name}</span>
                  </div>
                  <div className="rm2-card-row">
                    <span className="rm2-card-label">Location</span>
                    <span className="rm2-card-value">{person.location || "Not specified"}</span>
                  </div>
                  <div className="rm2-card-row">
                    <span className="rm2-card-label">Rent Budget</span>
                    <span className="rm2-card-value rm2-text-green">
                      {person.rent ? `₹${Number(person.rent).toLocaleString()}` : "N/A"}
                    </span>
                  </div>
                  {person.preferences && person.preferences !== "skipped" && (
                    <div className="rm2-pref-tags">
                      {person.preferences.split(",").slice(0, 3).map((pref, i) => (
                        <span key={i} className={`rm2-pref-tag ${myPreferences.includes(pref.trim()) ? "rm2-pref-match" : ""}`}>
                          {pref.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rm2-card-actions">
                  <button
                    className={`rm2-action-btn ${accepted ? "rm2-btn-chat" : "rm2-btn-locked"}`}
                    onClick={() => accepted && navigate("/dashboard/chat", { state: { selectedUserId: person.id } })}
                  >
                    <MessageCircle size={15} />
                    {accepted ? "Chat" : "Connect first"}
                  </button>
                  <button
                    className={`rm2-action-btn ${hasSent ? "rm2-btn-sent" : "rm2-btn-request"}`}
                    disabled={hasSent}
                    onClick={() => !hasSent && handleRequest(person.id, person.name)}
                  >
                    <UserPlus size={15} />
                    {hasSent ? "Sent" : "Connect"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
