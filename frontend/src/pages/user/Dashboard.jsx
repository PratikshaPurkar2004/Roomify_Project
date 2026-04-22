import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { Users, Home, FileText, UserPlus, UserSearch, Plus, MapPin, DollarSign, X, TrendingUp, Activity, Search } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateMatchPercentage } from "../../utils/matchUtils";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    requests: 0,
    views: 0,
    matches: 0,
  });

  const [users, setUsers] = useState([]);
  const [myPreferences, setMyPreferences] = useState([]);
  const [activeMetric, setActiveMetric] = useState("requests");
  const [graphData, setGraphData] = useState(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        requests: 0,
        matches: 0,
        views: 0
      });
    }
    return days;
  });


  const currentUser = JSON.parse(localStorage.getItem("user")) || {};


  const phrases = [
    "Find your ideal room/roommate to share it with.",
    "Matching verified rooms with the best roommate for you.",
    "The simplest way to find premium spaces and verified roommates.",
    "Connecting modern professionals to verified rooms and great roommates.",
    "Your home, your choice: shared rooms and great roommates in one place."
  ];
  const [randomPhrase] = useState(phrases[Math.floor(Math.random() * phrases.length)]);

  // Hero Image Carousel
  const heroImages = [
    {
      src: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      alt: "Modern Living Room"
    },
    {
      src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
      alt: "Roommates sharing a living space"
    },
    {
      src: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      alt: "Cozy bedroom for rent"
    },
    {
      src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      alt: "Happy roommates in apartment"
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };ī

  const handleTouchMove = (e) => {
    touchEndRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartRef.current - touchEndRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const chartData = [
    { name: 'Mon', views: Math.floor((stats.views || 0) * 0.4) + 12, matches: Math.floor((stats.matches || 0) * 0.3) + 5 },
    { name: 'Tue', views: Math.floor((stats.views || 0) * 0.6) + 18, matches: Math.floor((stats.matches || 0) * 0.5) + 8 },
    { name: 'Wed', views: Math.floor((stats.views || 0) * 0.8) + 24, matches: Math.floor((stats.matches || 0) * 0.7) + 12 },
    { name: 'Thu', views: Math.floor((stats.views || 0) * 0.7) + 21, matches: Math.floor((stats.matches || 0) * 0.6) + 10 },
    { name: 'Fri', views: Math.floor((stats.views || 0) * 0.9) + 29, matches: Math.floor((stats.matches || 0) * 0.8) + 15 },
    { name: 'Sat', views: (stats.views || 0) + 35, matches: Math.floor((stats.matches || 0) * 0.9) + 18 },
    { name: 'Sun', views: Math.floor((stats.views || 0) * 0.85) + 31, matches: (stats.matches || 0) + 16 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchData = useCallback(() => {
    const userId = localStorage.getItem("userId");
    const userIdParams = userId ? `?userId=${userId}` : "";

    fetch(`http://localhost:5000/api/dashboard/stats${userIdParams}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/dashboard/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.error(err));

    fetch(`http://localhost:5000/api/dashboard/graph-data${userIdParams}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const last7Days = [];
          const now = new Date();
          
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Generate YYYY-MM-DD in LOCAL time
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            const dayData = data.find(item => {
              return item.name === dayName || item.date === dateStr;
            });
            
            last7Days.push({
              name: dayName,
              date: dateStr,
              requests: dayData ? parseInt(dayData.requests || 0) : 0,
              matches: dayData ? parseInt(dayData.matches || 0) : 0,
              views: dayData ? parseInt(dayData.views || 0) : 0
            });
          }

          // --- SMART SYNC LOGIC ---
          // Ensure graph matches global stats if daily mapping fails due to timezone
          const totalMatches = last7Days.reduce((a, b) => a + b.matches, 0);
          const totalReqs = last7Days.reduce((a, b) => a + b.requests, 0);
          
          if (totalMatches === 0 && stats.matches > 0) {
            last7Days[last7Days.length - 1].matches = parseInt(stats.matches);
          }
          if (totalReqs === 0 && stats.requests > 0) {
            last7Days[last7Days.length - 1].requests = parseInt(stats.requests);
          }
          // -------------------------

          setGraphData(last7Days);

        }
      })

      .catch(err => console.error("Graph Data Fetch Error:", err));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);





  return (
    <div className="dashboard">
      <div className="dash-bg-shape dash-shape-1"></div>
      <div className="dash-bg-shape dash-shape-2"></div>
      <div className="dashboard-container">
        {/* Redesigned Unified Premium Hero Section */}
        <div className="dashboard-hero-premium">
          <div className="hero-main-content">
            <div className="hero-text-overlay">
              <span className="hero-badge">WELCOME BACK, {currentUser.name || "USER"}</span>
              <h1>Find your perfect <span className="text-gradient">room/roommate</span></h1>
              <span className="hero-badge">WELCOME BACK, {currentUser.name || "SAYALI"}</span>
              <h1>Find your perfect <span className="text-gradient">room/roommate</span></h1>
              <p>
                Our ecosystem simplifies your search for verified listings and compatible roommates. {randomPhrase}
              </p>

              <div className="hero-actions-premium">
                <button className="hero-btn-premium find-rooms" onClick={() => navigate("/dashboard/find-rooms")}>
                  <Search size={20} /> Find Rooms
                </button>
                <button className="hero-btn-premium find-roommates" onClick={() => navigate("/dashboard/find-roommates")}>
                  <UserSearch size={20} /> Find Roommates
                </button>
              </div>



              <div className="hero-stats-bar">
                <div className="stat-item">
                  <span className="stat-num">{stats.views || 0}</span>
                  <span className="stat-desc">#Views</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-num">{stats.matches || 0}</span>
                  <span className="stat-desc">#Matches</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item clickable" onClick={() => navigate("/dashboard/requests")}>
                  <span className="stat-num">{stats.requests || 0}</span>
                  <span className="stat-desc">#Requests</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item clickable" onClick={() => navigate("/dashboard/find-rooms")}>
                  <span className="stat-num">{stats.total_rooms || stats.rooms || 0}</span>
                  <span className="stat-desc">#Rooms</span>
                </div>
              </div>


            </div>
            <div
              className="hero-image-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="hero-carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {heroImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.src}
                    alt={img.alt}
                    className="hero-img-main"
                  />
                ))}
              </div>
              <div className="img-overlay-gradient"></div>

              {/* Navigation Arrows */}
              <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>&#8249;</button>
              <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>&#8250;</button>

              {/* Dots */}
              <div className="carousel-dots">
                {heroImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>




        {/* Global Activity Analytics */}
        <div className="finder-analytics-section-premium">
          <div className="analytics-card-glass">
            <div className="analytics-header-compact">
              <div className="header-meta">
                <div className="icon-badge-violet">
                  <Activity size={20} />
                </div>
                <div>
                  <h3>Performance Analytics</h3>
                  <div className="analytics-toggles">
                    <button
                      className={`toggle-btn ${activeMetric === 'views' ? 'active' : ''}`}
                      onClick={() => setActiveMetric('views')}
                    >Views</button>
                    <button
                      className={`toggle-btn ${activeMetric === 'requests' ? 'active' : ''}`}
                      onClick={() => setActiveMetric('requests')}
                    >Requests</button>
                    <button
                      className={`toggle-btn ${activeMetric === 'matches' ? 'active' : ''}`}
                      onClick={() => setActiveMetric('matches')}
                    >Matches</button>
                  </div>
                </div>
              </div>
              <div className="stats-pill-green">
                <TrendingUp size={16} /> <span>{activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} {stats.views > 0 ? ((stats[activeMetric] / stats.views) * 100).toFixed(1) : "0.0"}%</span>
              </div>
            </div>

            <div className="chart-wrapper-premium" style={{ height: '400px', width: '100%', background: '#fff', borderRadius: '24px', padding: '20px', border: '1px solid #edf2f7' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={graphData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={30} domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      background: 'white',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={activeMetric === 'matches' ? '#a855f7' : '#6366f1'}
                    strokeWidth={3}
                    fill={activeMetric === 'matches' ? '#a855f7' : '#6366f1'}
                    fillOpacity={0.2}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>


          </div>
        </div>




      </div>


    </div>
  );
}

export default Dashboard;
