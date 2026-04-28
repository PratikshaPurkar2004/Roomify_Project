import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Home, ArrowLeft, Users, Shield, CheckCircle2, ChevronLeft, ChevronRight, IndianRupee, BedDouble, Wifi } from "lucide-react";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [curIdx, setCurIdx] = useState(0);
  const touchStartX = useRef(null);
  const mouseStartX = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://localhost:5000/api/rooms/${id}`)
      .then(r => r.json())
      .then(data => { if (data.success) setRoom(data.room); else setError(data.message || "Not found"); })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

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
        .rd-arrow-btn { position:absolute; top:50%; transform:translateY(-50%); z-index:20; background:rgba(255,255,255,0.18); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,0.3); color:white; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; }
        .rd-arrow-btn:hover { background:rgba(255,255,255,0.38); transform:translateY(-50%) scale(1.05); }
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
        .rd-safety { margin:0 22px 18px; background:#fffbeb; border:1px solid #fde68a; border-radius:12px; padding:12px 14px; font-size:12px; color:#92400e; font-weight:600; line-height:1.5; }

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

        {/* PHOTO GRID */}
        {images.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '2fr 1fr' : '1fr', gap: '16px', height: '400px', marginBottom: '10px', borderRadius: '24px', overflow: 'hidden' }}>
            {/* Main Photo */}
            <div style={{ height: '100%' }}>
              <img src={`http://localhost:5000${images[0]}`} alt="Main Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            {/* Side Photos (if any) */}
            {images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px', height: '100%' }}>
                {images.slice(1, 3).map((img, i) => (
                  <div key={i} style={{ height: '100%', position: 'relative' }}>
                    <img src={`http://localhost:5000${img}`} alt={`Room ${i+2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {i === 1 && images.length > 3 && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 800 }}>
                        +{images.length - 3} Photos
                      </div>
                    )}
                  </div>
                ))}
                {images.length === 2 && (
                   <div style={{ height: '100%', background: '#e2e8f0' }}></div>
                )}
              </div>
            )}
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
        </div>

        {/* RIGHT — BOOKING */}
        <div>
          <div className="rd-book">
            <div className="rd-book-head">
              <div className="rd-book-price">₹{Number(room.rent).toLocaleString()} <span>/ pp / mo</span></div>
              {totalRent && <div className="rd-book-pp"><IndianRupee size={12} /> ₹{totalRent.toLocaleString()} total rent</div>}
            </div>
            <div className="rd-book-body">
              <button className="rd-cta-btn">Request to Connect</button>
              <p className="rd-cta-note">You won't be charged until accepted</p>
              <div className="rd-breakdown">
                <div className="rd-brow"><span style={{color:'#64748b',fontWeight:600}}>₹{Number(room.rent).toLocaleString()} × 1 month</span><span style={{fontWeight:700,color:'#1e293b'}}>₹{Number(room.rent).toLocaleString()}</span></div>
                <div className="rd-brow"><span style={{color:'#64748b',fontWeight:600}}>Service fee</span><span style={{fontWeight:700,color:'#10b981'}}>Free</span></div>
                <div className="rd-brow"><span>Total</span><span style={{color:'#6366f1'}}>₹{Number(room.rent).toLocaleString()}</span></div>
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
            <div className="rd-safety">🛡️ Never transfer money outside Roomify. We don't guarantee off-platform transactions.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
