import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Home, ArrowLeft, Users, Shield, CheckCircle2, ChevronLeft, ChevronRight, IndianRupee, BedDouble, Wifi, Star, X, Pencil } from "lucide-react";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [curIdx, setCurIdx] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const userId = localStorage.getItem("userId");
  const touchStartX = useRef(null);
  const mouseStartX = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch room details
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`)
      .then(r => r.json())
      .then(data => { if (data.success) setRoom(data.room); else setError(data.message || "Not found"); })
      .catch(() => setError("Failed to load room"))
      .finally(() => setLoading(false));

    // Fetch reviews
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}/reviews`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
          if (data.reviews.length > 0) {
            const avg = data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length;
            setAvgRating(avg);
            setReviewCount(data.reviews.length);
          }
        }
      })
      .catch(err => console.error("Error fetching reviews:", err));
  }, [id]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) return (
    <div style={{ marginLeft:'280px', display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:'40px', height:'40px', border:'4px solid #e2e8f0', borderTop:'4px solid #6366f1', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }}></div>
        <p style={{ color:'#64748b', fontWeight:600 }}>Loading room...</p>
      </div>
    </div>
  );

  if (error || !room) return (
    <div style={{ marginLeft:'280px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:'14px' }}>
      <Home size={64} color="#cbd5e1" />
      <h2 style={{ color:'#1e293b' }}>{error || "Room not found"}</h2>
      <button onClick={() => navigate(-1)} style={{ background:'#6366f1', color:'white', border:'none', padding:'11px 24px', borderRadius:'12px', fontWeight:700, cursor:'pointer' }}>← Go Back</button>
    </div>
  );

  let images = [];
  try { images = JSON.parse(room.image_url); if (!Array.isArray(images)) images = [room.image_url]; }
  catch { images = room.image_url ? [room.image_url] : []; }

  const amenities = room.amenities ? room.amenities.split(",").map(a => a.trim()).filter(Boolean) : [];
  const totalRent = room.max_tenants > 1 ? Number(room.rent) * Number(room.max_tenants) : null;
  const total = images.length;

  const goTo = (i) => setCurIdx((i + total) % total);
  const goNext = () => goTo(curIdx + 1);
  const goPrev = () => goTo(curIdx - 1);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };
  const onMouseDown = (e) => { mouseStartX.current = e.clientX; isDragging.current = true; };
  const onMouseUp = (e) => {
    if (!isDragging.current) return;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    isDragging.current = false;
  };

  const fetchReviews = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}/reviews`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
          if (data.reviews.length > 0) {
            const avg = data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length;
            setAvgRating(avg);
            setReviewCount(data.reviews.length);
          } else {
            setAvgRating(0);
            setReviewCount(0);
          }
        }
      })
      .catch(err => console.error("Error fetching reviews:", err));
  };



  const submitReview = async () => {
    if (!userId) { setToast("Please login to review!"); return; }
    setSubmitting(true);
    try {
      const url = editReviewId 
        ? `${import.meta.env.VITE_API_URL}/api/rooms/reviews/${editReviewId}` 
        : `${import.meta.env.VITE_API_URL}/api/rooms/${id}/reviews`;
      
      const method = editReviewId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, rating: newRating, comment: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setToast(editReviewId ? "Review updated! ⭐" : "Review submitted! ⭐");
        setShowReviewModal(false);
        setEditReviewId(null);
        setNewComment("");
        setNewRating(0);
        setEditReviewId(null);
        fetchReviews();
      } else {
        setToast(data.message || "Failed to submit");
      }
    } catch {
      setToast("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (data.success) {
        setToast("Review deleted! 🗑️");
        fetchReviews();
      }
    } catch {
      setToast("Error deleting review");
    }
  };

  const openEditReview = (rev) => {
    setEditReviewId(rev.review_id);
    setNewRating(rev.rating);
    setNewComment(rev.comment);
    setShowReviewModal(true);
  };

  return (
    <div style={{ marginLeft:'280px', minHeight:'100vh', background:'#f5f7fa', fontFamily:"'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        /* SLIDER */
        .rd-slider-wrap { position:relative; height:520px; background:#111827; overflow:hidden; cursor:grab; user-select:none; }
        .rd-slider-wrap:active { cursor:grabbing; }
        .rd-slider-track { display:flex; height:100%; transition:transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94); will-change:transform; }
        .rd-slide { flex-shrink:0; width:100%; height:100%; position:relative; }
        .rd-slide img { width:100%; height:100%; object-fit:cover; display:block; }
        .rd-slide-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 55%); pointer-events:none; }
        .rd-back-pill { position:absolute; top:20px; left:24px; z-index:20; display:flex; align-items:center; gap:7px; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); color:white; border:1px solid rgba(255,255,255,0.3); padding:9px 18px; border-radius:50px; font-weight:700; font-size:14px; cursor:pointer; transition:background 0.2s; }
        .rd-back-pill:hover { background:rgba(255,255,255,0.28); }
        .rd-counter { position:absolute; top:20px; right:24px; z-index:20; background:rgba(0,0,0,0.5); color:white; padding:6px 14px; border-radius:50px; font-size:13px; font-weight:700; backdrop-filter:blur(6px); }
        .rd-arrow-btn { position:absolute; top:50%; transform:translateY(-50%); z-index:20; background:rgba(0,0,0,0.3); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.4); color:white; width:54px; height:54px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .rd-arrow-btn:hover { background:rgba(0,0,0,0.6); transform:translateY(-50%) scale(1.1); box-shadow: 0 6px 20px rgba(0,0,0,0.5); }
        .rd-arrow-l { left:20px; }
        .rd-arrow-r { right:20px; }
        .rd-hero-text { position:absolute; bottom:0; left:0; right:0; padding:22px 32px 28px; pointer-events:none; }
        .rd-hero-title { font-size:34px; font-weight:900; color:white; margin:0 0 8px; text-shadow:0 2px 10px rgba(0,0,0,0.5); letter-spacing:-0.5px; }
        .rd-hero-loc { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,0.88); font-size:15px; font-weight:600; }
        .rd-avail-dot { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:4px; }

        /* DOTS */
        .rd-dots { display:flex; justify-content:center; gap:8px; padding:14px 0; background:#111827; }
        .rd-dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.35); cursor:pointer; transition:all 0.25s; border:none; }
        .rd-dot.active { background:#6366f1; width:24px; border-radius:4px; }

        /* LAYOUT */
        .rd-layout { display:grid; grid-template-columns:1fr 360px; gap:28px; padding:32px; max-width:1160px; animation:fadeUp 0.4s ease-out; }

        /* LEFT CARDS */
        .rd-card { background:white; border-radius:20px; border:1px solid #e2e8f0; padding:24px 26px; margin-bottom:20px; }
        .rd-card h2 { font-size:19px; font-weight:800; color:#0f172a; margin:0 0 16px; }

        /* PRICE ROW */
        .rd-price-big { font-size:38px; font-weight:900; color:#0f172a; }
        .rd-price-big span { font-size:16px; font-weight:500; color:#94a3b8; }
        .rd-pp-badge { display:inline-flex; align-items:center; gap:5px; background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; padding:6px 14px; border-radius:50px; font-size:13px; font-weight:700; margin-top:10px; }

        /* TILES */
        .rd-tiles { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .rd-tile { background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:18px 16px; transition:all 0.2s; }
        .rd-tile:hover { border-color:#6366f1; background:white; box-shadow:0 4px 16px rgba(99,102,241,0.1); }
        .rd-tile-lbl { font-size:11px; color:#94a3b8; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
        .rd-tile-val { font-size:16px; font-weight:800; color:#0f172a; }

        /* CHIPS */
        .rd-chips { display:flex; flex-wrap:wrap; gap:10px; }
        .rd-chip { display:flex; align-items:center; gap:7px; background:#f8fafc; border:1px solid #e2e8f0; padding:9px 16px; border-radius:50px; font-size:13px; font-weight:600; color:#475569; transition:all 0.2s; }
        .rd-chip:hover { border-color:#6366f1; color:#6366f1; background:#f5f3ff; }

        /* BOOK CARD */
        .rd-book { background:white; border-radius:20px; border:1px solid #e2e8f0; box-shadow:0 8px 32px rgba(0,0,0,0.08); overflow:hidden; position:sticky; top:24px; }
        .rd-book-head { background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%); padding:26px; }
        .rd-book-price { font-size:36px; font-weight:900; color:white; letter-spacing:-1px; }
        .rd-book-price span { font-size:15px; color:#94a3b8; font-weight:500; }
        .rd-book-pp { display:inline-flex; align-items:center; gap:5px; background:rgba(99,102,241,0.25); color:#a5b4fc; border:1px solid rgba(99,102,241,0.35); padding:5px 12px; border-radius:50px; font-size:12px; font-weight:700; margin-top:10px; }
        .rd-book-body { padding:22px; }
        .rd-cta-btn { width:100%; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:white; border:none; padding:16px; border-radius:14px; font-size:16px; font-weight:800; cursor:pointer; margin-bottom:10px; transition:all 0.25s; }
        .rd-cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,0.4); }
        .rd-cta-note { text-align:center; font-size:12px; color:#94a3b8; margin-bottom:18px; }
        .rd-breakdown { background:#f8fafc; border-radius:14px; padding:16px 18px; margin-bottom:20px; }
        .rd-brow { display:flex; justify-content:space-between; font-size:14px; margin-bottom:10px; }
        .rd-brow:last-child { margin:0; border-top:1px solid #e2e8f0; padding-top:10px; font-weight:800; color:#0f172a; font-size:15px; }
        .rd-host-sec { border-top:1px solid #f1f5f9; padding:20px 22px; }
        .rd-host-row { display:flex; align-items:center; gap:14px; margin-bottom:12px; }
        .rd-avatar { width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#a855f7); display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900; color:white; flex-shrink:0; }
        .rd-host-name { font-size:17px; font-weight:800; color:#0f172a; margin:0; }
        .rd-host-sub { font-size:12px; color:#94a3b8; font-weight:600; margin-top:3px; }
        .rd-verified { display:flex; align-items:center; gap:6px; color:#10b981; font-size:13px; font-weight:700; margin-bottom:14px; }
        
        /* REVIEWS */
        .rd-review { border-bottom: 1px solid #f1f5f9; padding: 20px 0; }
        .rd-review:last-child { border-bottom: none; }
        .rd-rev-user { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .rd-rev-avatar { width: 36px; height: 36px; border-radius: 50%; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #6366f1; }
        .rd-rev-name { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0; }
        .rd-rev-date { font-size: 12px; color: #94a3b8; font-weight: 500; }
        .rd-rev-comment { font-size: 14px; color: #475569; line-height: 1.6; margin: 8px 0 0; }
        .rd-rating-summary { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; }
        .rd-rating-big { font-size: 44px; font-weight: 900; color: #0f172a; line-height: 1; }
        .rd-rating-stars { display: flex; flex-direction: column; gap: 4px; }
        
        /* TOAST */
        .rd-toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); background: #1e293b; color: white; padding: 10px 24px; border-radius: 50px; font-weight: 700; z-index: 9999; box-shadow: 0 8px 30px rgba(0,0,0,0.2); animation: fadeUp 0.3s ease; }

        /* MODAL */
        .rd-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .rd-modal { background: white; width: 100%; max-width: 480px; border-radius: 24px; overflow: hidden; animation: fadeUp 0.3s ease; }
        .rd-modal-head { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .rd-modal-body { padding: 24px; }
        .rd-modal-foot { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; }
        .rd-star-btn { background: none; border: none; cursor: pointer; padding: 4px; transition: transform 0.2s; }
        .rd-star-btn:hover { transform: scale(1.2); }

      `}</style>

      {/* PAGE HEADER & PHOTOS */}
      <div style={{ maxWidth: '1160px', padding: '32px 32px 0' }}>
        <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'#64748b', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', marginBottom:'20px', padding:0 }}><ArrowLeft size={16} /> Back</button>
        
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>{room.property_type} in {room.location?.split(',')[0]}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '15px', fontWeight: 600, marginBottom: '24px' }}>
          <MapPin size={16} /> {room.address || room.location}
          <span style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width:'8px', height:'8px', borderRadius:'50%', background: room.availability === 'available' ? '#10b981' : '#ef4444' }}></span>
            <span style={{ fontSize:'12px', fontWeight:800, textTransform:'uppercase', color: room.availability === 'available' ? '#10b981' : '#ef4444' }}>{room.availability}</span>
          </span>
        </div>

        {/* SWIPABLE HERO CAROUSEL */}
        {images.length > 0 ? (
          <div 
            className="rd-slider-wrap" 
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ borderRadius: '24px', marginBottom: '16px' }}
          >
            <div className="rd-slider-track" style={{ transform: `translateX(-${curIdx * 100}%)` }}>
              {images.map((img, i) => (
                <div key={i} className="rd-slide">
                  <img src={`${import.meta.env.VITE_API_URL}${img}`} alt={`Room ${i+1}`} />
                  <div className="rd-slide-overlay"></div>
                </div>
              ))}
            </div>

            {/* Arrows */}
            {total > 1 && (
              <>
                <button className="rd-arrow-btn rd-arrow-l" onClick={goPrev}><ChevronLeft size={24} /></button>
                <button className="rd-arrow-btn rd-arrow-r" onClick={goNext}><ChevronRight size={24} /></button>
                <div className="rd-counter">{curIdx + 1} / {total}</div>
              </>
            )}
          </div>
        ) : (
          <div style={{ height: '400px', background: '#e2e8f0', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', marginBottom: '16px' }}>
            <Home size={64} />
          </div>
        )}

        {/* DOTS */}
        {total > 1 && (
          <div className="rd-dots" style={{ background: 'transparent', padding: '0 0 20px' }}>
            {images.map((_, i) => (
              <button key={i} className={`rd-dot ${i === curIdx ? 'active' : ''}`} onClick={() => goTo(i)}></button>
            ))}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="rd-layout">
        {/* LEFT */}
        <div>
          <div className="rd-card">
            <div className="rd-price-big">₹{Number(room.rent).toLocaleString()} <span>/ person / month</span></div>
            {totalRent && (
              <div className="rd-pp-badge"><IndianRupee size={14} /> ₹{totalRent.toLocaleString()} total property rent</div>
            )}
          </div>

          {/* Details Tiles */}
          <div className="rd-card">
            <h2>Property Details</h2>
            <div className="rd-tiles">
              <div className="rd-tile"><div className="rd-tile-lbl">Max Tenants</div><div className="rd-tile-val"><Users size={14} color="#6366f1" style={{marginRight:6}} />{room.max_tenants || '–'} People</div></div>
              <div className="rd-tile"><div className="rd-tile-lbl">Looking For</div><div className="rd-tile-val"><BedDouble size={14} color="#6366f1" style={{marginRight:6}} />{room.required_tenants || 1} Roommate(s)</div></div>
              <div className="rd-tile"><div className="rd-tile-lbl">Furnishing</div><div className="rd-tile-val">{room.furnishing || '–'}</div></div>
              <div className="rd-tile"><div className="rd-tile-lbl">Property Type</div><div className="rd-tile-val" style={{fontSize:'13px'}}>{room.property_type || '–'}</div></div>
            </div>
          </div>

          <div className="rd-card">
            <h2>About this space</h2>
            <p style={{ color:'#475569', fontSize:'15px', lineHeight:1.85, margin:0 }}>
              Welcome to this <strong>{room.furnishing?.toLowerCase()}</strong> {room.property_type?.toLowerCase()} in <strong>{room.location}</strong>.
              This property accommodates up to <strong>{room.max_tenants} people</strong> and is currently looking for <strong>{room.required_tenants || 1} roommate(s)</strong>.
              Located at <strong>{room.address || room.location}</strong>, it offers easy access to local transport and amenities.
              Each person contributes exactly <strong style={{color:'#16a34a'}}>₹{Number(room.rent).toLocaleString()} per month</strong>.
            </p>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="rd-card">
              <h2>What's included</h2>
              <div className="rd-chips">
                {amenities.map((a, i) => <span key={i} className="rd-chip"><CheckCircle2 size={15} color="#10b981" /> {a}</span>)}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="rd-card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <h2 style={{ margin:0 }}>Reviews & Ratings</h2>
              <button onClick={() => setShowReviewModal(true)} style={{ background:'#f5f3ff', color:'#6366f1', border:'1px solid #ddd6fe', padding:'7px 16px', borderRadius:'50px', fontSize:'13px', fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>+ Write a Review</button>
            </div>
            
            {reviews.length > 0 ? (
              <>
                <div className="rd-rating-summary" style={{ display:'flex', gap:'40px', alignItems:'center', flexWrap:'wrap' }}>
                  <div style={{ textAlign:'center' }}>
                    <div className="rd-rating-big">
                      {reviews.length > 0 
                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                        : "0.0"}
                    </div>
                    <div style={{ display:'flex', gap:'2px', justifyContent:'center', marginBottom:'4px' }}>
                      {[...Array(5)].map((_, i) => {
                        const avg = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0;
                        return <Star key={i} size={16} fill={i < Math.round(avg) ? "#f59e0b" : "none"} color={i < Math.round(avg) ? "#f59e0b" : "#cbd5e1"} />;
                      })}
                    </div>
                    <div style={{ fontSize:'13px', color:'#94a3b8', fontWeight:600 }}>{reviews.length} review(s)</div>
                  </div>

                  <div style={{ flex:1, minWidth:'200px', display:'flex', flexDirection:'column', gap:'8px' }}>
                    {[5,4,3,2,1].map(num => {
                      const count = reviews.filter(r => Number(r.rating) == num).length;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={num} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          <span style={{ fontSize:'12px', fontWeight:600, color:'#475569', minWidth:'12px' }}>{num}</span>
                          <div style={{ flex:1, height:'6px', background:'#f1f5f9', borderRadius:'10px', overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', background:'#f59e0b', borderRadius:'10px' }}></div>
                          </div>
                          <span style={{ fontSize:'11px', color:'#94a3b8', minWidth:'25px', textAlign:'right' }}>{Math.round(pct)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rd-reviews-list">
                  {reviews.map((rev, i) => (
                    <div key={i} className="rd-review">
                      <div className="rd-rev-user">
                        <div style={{ display:'flex', alignItems:'center', gap:'12px', flex:1 }}>
                          <div className="rd-rev-avatar" style={{ background: `hsl(${(rev.user_id * 47) % 360}, 60%, 55%)`, color:'white' }}>
                            {rev.reviewer_name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <p className="rd-rev-name">{rev.reviewer_name || "Anonymous User"}</p>
                              {rev.rating >= 4 && (
                                <div style={{ display:'flex', alignItems:'center', gap:2, background:'#f0fdf4', padding:'2px 6px', borderRadius:'4px', border:'1px solid #dcfce7' }}>
                                  <CheckCircle2 size={10} color="#16a34a" />
                                  <span style={{ fontSize:'10px', color:'#16a34a', fontWeight:700, textTransform:'uppercase' }}>Top Rated</span>
                                </div>
                              )}
                            </div>
                            <p className="rd-rev-date">{new Date(rev.review_date).toLocaleDateString('en-US', { day:'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        {parseInt(userId) === rev.user_id && (
                          <div style={{ display:'flex', gap:4 }}>
                            <button onClick={() => openEditReview(rev)} style={{ background:'none', border:'none', color:'#6366f1', cursor:'pointer', padding:'8px', borderRadius:'50%', transition:'background 0.2s' }} title="Edit Review">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => deleteReview(rev.review_id)} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', padding:'8px', borderRadius:'50%', transition:'background 0.2s' }} title="Delete Review">
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={{ display:'flex', gap:'2px', marginBottom:'8px' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.rating ? "#f59e0b" : "none"} color={i < rev.rating ? "#f59e0b" : "#cbd5e1"} />)}
                      </div>
                      <p className="rd-rev-comment">{rev.comment}</p>
                    </div>
                  ))}
                </div>
                
                {reviews.length > 3 && (
                  <button style={{ width:'100%', background:'none', border:'1px solid #e2e8f0', padding:'12px', borderRadius:'12px', marginTop:'20px', color:'#6366f1', fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
                    View All {reviews.length} Reviews
                  </button>
                )}
              </>
            ) : (
              <div style={{ textAlign:'center', padding:'20px', color:'#94a3b8' }}>
                <Star size={40} style={{ marginBottom:'10px', opacity:0.5 }} />
                <p>No reviews yet for this room.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — BOOKING */}
        <div>
          <div className="rd-book">
            <div className="rd-book-head">
              <div className="rd-book-price">₹{Number(room.rent).toLocaleString()} <span>/ pp / mo</span></div>
              {totalRent && <div className="rd-book-pp"><IndianRupee size={12} /> ₹{totalRent.toLocaleString()} total rent</div>}
              {reviewCount > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'12px', background:'rgba(245,158,11,0.15)', padding:'6px 14px', borderRadius:'50px', border:'1px solid rgba(245,158,11,0.3)' }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize:'14px', fontWeight:800, color:'#fbbf24' }}>{avgRating.toFixed(1)}</span>
                  <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)', fontWeight:600 }}>({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                </div>
              )}
            </div>
            <div className="rd-book-body">
              <button className="rd-cta-btn">Request to Connect</button>
              <p className="rd-cta-note">You won't be charged until accepted</p>
              <div className="rd-breakdown">
                <div className="rd-brow">
                  <span style={{color:'#64748b',fontWeight:600}}>Monthly Rent</span>
                  <span style={{fontWeight:700,color:'#1e293b'}}>₹{Number(room.rent).toLocaleString()}</span>
                </div>
                <div className="rd-brow" style={{ marginTop:'8px', paddingTop:'8px', borderTop:'1px solid #e2e8f0' }}>
                  <span style={{ fontWeight:800, color:'#0f172a' }}>Total</span>
                  <span style={{ color:'#6366f1', fontWeight:900 }}>₹{Number(room.rent).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="rd-host-sec">
              <h4 style={{fontSize:'15px',fontWeight:800,color:'#0f172a',margin:'0 0 14px'}}>Meet your Host</h4>
              <div className="rd-host-row">
                <div className="rd-avatar">{room.host_name?.charAt(0)?.toUpperCase()}</div>
                <div><p className="rd-host-name">{room.host_name}</p><p className="rd-host-sub">Verified Host · Roomify</p></div>
              </div>
              <div className="rd-verified"><Shield size={14} /> Identity Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && <div className="rd-toast">{toast}</div>}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="rd-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="rd-modal" onClick={e => e.stopPropagation()}>
            <div className="rd-modal-head">
              <h3 style={{ margin:0, fontWeight:900 }}>{editReviewId ? "Edit Your Review" : "Write a Review"}</h3>
              <button onClick={() => { setShowReviewModal(false); setEditReviewId(null); }} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer' }}><X size={24} /></button>
            </div>
            <div className="rd-modal-body">
              <p style={{ fontSize:'14px', color:'#64748b', marginBottom:'16px' }}>{editReviewId ? "Update your rating and comments below." : "How was your experience with this property?"}</p>
              
              <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'24px' }} onMouseLeave={() => setHoverRating(0)}>
                {[1,2,3,4,5].map(val => (
                  <button 
                    key={val} 
                    className="rd-star-btn" 
                    onClick={() => setNewRating(val)}
                    onMouseEnter={() => setHoverRating(val)}
                  >
                    <Star 
                      size={36} 
                      fill={(hoverRating || newRating) >= val ? "#f59e0b" : "none"} 
                      color={(hoverRating || newRating) >= val ? "#f59e0b" : "#cbd5e1"} 
                    />
                  </button>
                ))}
              </div>

              <textarea 
                placeholder="Write your feedback here..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{ width:'100%', minHeight:'120px', padding:'16px', borderRadius:'16px', border:'1.5px solid #e2e8f0', fontFamily:'inherit', fontSize:'15px', resize:'none', outline:'none' }}
              />
            </div>
            <div className="rd-modal-foot">
              <button onClick={() => { setShowReviewModal(false); setEditReviewId(null); }} style={{ flex:1, padding:'12px', borderRadius:'12px', border:'1px solid #e2e8f0', background:'white', fontWeight:700, cursor:'pointer' }}>Cancel</button>
              <button 
                onClick={submitReview} 
                disabled={submitting}
                style={{ flex:2, padding:'12px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:800, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? (editReviewId ? "Updating..." : "Submitting...") : (editReviewId ? "Update Review" : "Submit Review")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
