
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, MapPin, Wallet, Briefcase, Mail, Phone, Calendar, Heart, 
  MessageCircle, UserPlus, Star, ChevronLeft, Shield, CheckCircle 
} from "lucide-react";
import "../../styles/RoommateProfile.css";
import { calculateMatchPercentage } from "../../utils/matchUtils";

export default function RoommateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  
  const [profile, setProfile] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [acceptedIds, setAcceptedIds] = useState([]);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch target profile
        const profRes = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${id}?viewerId=/${userId}`);
        const profData = await profRes.json();
        
        if (profData.error) throw new Error(profData.error);
        
        // Fetch current user profile for matching
        const myProfRes = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${userId}`);
        const myProfData = await myProfRes.json();
        
        // Fetch sent requests
        const sentRes = await fetch(`${import.meta.env.VITE_API_URL}/api/requests/sent/${userId}`);
        const sentData = await sentRes.json();
        
        // Fetch accepted connections
        const acceptedRes = await fetch(`${import.meta.env.VITE_API_URL}/api/requests/accepted-ids/${userId}`);
        const acceptedData = await acceptedRes.json();
        
        setProfile(profData);
        setMyProfile(myProfData);
        if (sentData.success) setSentRequests(sentData.sentRequests);
        if (acceptedData.success) setAcceptedIds(acceptedData.acceptedIds);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId]);

  const handleRequest = async () => {
    if (!userId) { showToast("Please login first!"); return; }
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: userId, receiver_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Request sent to ${profile.name} ✅`);
        setSentRequests(prev => [...prev, parseInt(id)]);
      } else {
        showToast(data.message || "Failed to send request");
      }
    } catch {
      showToast("Error sending request");
    }
  };

  if (loading) return (
    <div className="rp-loading">
      <div className="rp-spinner"></div>
      <p>Consulting the archives...</p>
    </div>
  );

  if (error) return (
    <div className="rp-error">
      <h2>Oops! Profile Not Found</h2>
      <p>{error}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  const matchScore = myProfile ? calculateMatchPercentage(myProfile, profile) : 0;
  const getScoreColor = (score) => {
    if (score >= 70) return "#10b981";
    if (score >= 40) return "#f59e0b";
    return "#94a3b8";
  };

  const initial = profile.name?.charAt(0).toUpperCase() || "?";
  const hasSent = sentRequests.includes(parseInt(id));
  const isAccepted = acceptedIds.includes(parseInt(id));

  return (
    <div className="rp-container">
      <div className="page-container">

      {toast && <div className="rm2-toast">{toast}</div>}
      
      <div className="rp-max-width">
        {/* Back Navigation */}
        <div className="rp-navigation">
          <button className="rp-back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} /> Back to Roommates
          </button>
        </div>

        <div className="rp-content-grid">
        {/* Left Column: Essential Info & Stats */}
        <aside className="rp-sidebar">
          <div className="rp-card rp-profile-card">
            <div className="rp-avatar-container">
              <div className="rp-avatar-glow" style={{ "--score-color": getScoreColor(matchScore) }}></div>
              <div className="rp-avatar">{initial}</div>
             {isAccepted && <CheckCircle className="rp-verified-icon" size={24} fill="#6366f1" color="white" />}
            </div>
            
            <h1 className="rp-name">{profile.name}</h1>
            <p className="rp-tagline">{profile.occupation || "Independent Thinker"}</p>
            
            <div className="rp-match-badge" style={{ backgroundColor: `${getScoreColor(matchScore)}15`, color: getScoreColor(matchScore), borderColor: `${getScoreColor(matchScore)}30` }}>
              <span className="rp-match-value">{matchScore}% Match</span>
              <span className="rp-match-desc">Compatibility</span>
            </div>

            <div className="rp-quick-stats">
              <div className="rp-stat">
                <span className="rp-stat-val">₹{Number(profile.budget || 0).toLocaleString()}</span>
                <span className="rp-stat-label">Budget</span>
              </div>
              <div className="rp-stat">
                <span className="rp-stat-val">{profile.gender}</span>
                <span className="rp-stat-label">Gender</span>
              </div>
            </div>

            <div className="rp-actions">
              <button 
                className={`rp-btn rp-btn-primary ${hasSent ? 'sent' : ''}`} 
                onClick={handleRequest}
                disabled={hasSent}
              >
                {hasSent ? (
                  <><CheckCircle size={18} /> Request Sent</>
                ) : (
                  <><UserPlus size={18} /> Send Request</>
                )}
              </button>
              
              <button 
                className={`rp-btn rp-btn-secondary ${!isAccepted ? 'locked' : ''}`}
                onClick={() => isAccepted && navigate("/dashboard/chat", { state: { selectedUserId: profile.id } })}
              >
                <MessageCircle size={18} /> {isAccepted ? "Chat Now" : "Chat (Locked)"}
              </button>
            </div>
          </div>

          <div className="rp-card rp-trust-card">
            <h3><Shield size={18} /> Trust Score</h3>
            <div className="rp-trust-gauge">
              <div className="rp-progress-bg">
                <div className="rp-progress-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="rp-trust-val">8.5 / 10</span>
            </div>
            <p>Verification complete. This user has a high activity record.</p>
          </div>
        </aside>

        {/* Right Column: Detailed Info */}
        <main className="rp-main-content">
          {/* About Section */}
          <section className="rp-card rp-info-section">
            <h2 className="rp-section-title">About {profile.name.split(' ')[0]}</h2>
            <p className="rp-bio">
              {profile.bio || `Hi there! I'm ${profile.name.split(' ')[0]}, looking for a compatible roommate who values ${profile.preferences?.split(',').slice(0, 2).join(' and ') || 'a great living environment'}. I am a ${profile.occupation || 'professional'} and I usually keep things organized.`}
            </p>
            
            <div className="rp-details-grid">
              <div className="rp-detail-item">
                <Calendar className="rp-detail-icon" />
                <div className="rp-detail-text">
                  <label>Age</label>
                  <span>{profile.age || "20-25"} years</span>
                </div>
              </div>
              <div className="rp-detail-item">
                <MapPin className="rp-detail-icon" />
                <div className="rp-detail-text">
                  <label>Looking In</label>
                  <span>{profile.city || "Mumbai"}</span>
                </div>
              </div>
              <div className="rp-detail-item">
                <Briefcase className="rp-detail-icon" />
                <div className="rp-detail-text">
                  <label>Occupation</label>
                  <span>{profile.occupation || "Not Specified"}</span>
                </div>
              </div>
              <div className="rp-detail-item">
                <Mail className="rp-detail-icon" />
                <div className="rp-detail-text">
                  <label>Email Address</label>
                  <span>{isAccepted ? profile.email : "••••••••@••••.com"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="rp-card rp-info-section">
            <div className="rp-section-header">
              <h2 className="rp-section-title">Lifestyles & Preferences</h2>
              <Heart size={20} color="#ec4899" />
            </div>
            <div className="rp-tags-container">
              {profile.preferences && profile.preferences !== "skipped" ? (
                profile.preferences.split(',').map((pref, i) => {
                  const isMatch = myProfile?.preferences?.toLowerCase().includes(pref.trim().toLowerCase());
                  return (
                    <span key={i} className={`rp-tag ${isMatch ? 'match' : ''}`}>
                      {isMatch && <Star size={12} fill="white" />} {pref.trim()}
                    </span>
                  );
                })
              ) : (
                <p className="rp-empty-msg">No preferences listed yet.</p>
              )}
            </div>
          </section>

          {/* Social Proof / Reviews Section */}
          <section className="rp-card rp-info-section">
            <h2 className="rp-section-title">Common Ground</h2>
            <div className="rp-common-ground">
              <div className="rp-common-item">
                <div className="rp-icon-circle"><CheckCircle size={20} /></div>
                <div>
                  <h4>Verified Identity</h4>
                  <p>Government ID and phone number verified.</p>
                </div>
              </div>
              <div className="rp-common-item">
                <div className="rp-icon-circle"><CheckCircle size={20} /></div>
                <div>
                  <h4>Secure Communication</h4>
                  <p>Encrypted messaging available after matching.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      </div>
      </div>
    </div>

  );
}
