import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

import Login from "./auth/Login";
import Registration from "./auth/Registration";
import HomeNavbar from "../Component/HomeNavbar";

export default function Home() {

const navigate = useNavigate();
const [showLogin, setShowLogin] = useState(false);
const [showRegister, setShowRegister] = useState(false);
const [activeTab,setActiveTab] = useState("rent");
const [propertyFilter, setPropertyFilter] = useState("All");
const [cities, setCities] = useState([]);

useEffect(() => {
  const fetchCities = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/cities");
      if (data.success && data.cities) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities(['Mumbai', 'Pune', 'Nashik', 'Hyderabad']);
    }
  };
  fetchCities();
}, []);

const rentSteps = [
"Fill up a form with the basic details about your apartment",
"Sign up and complete your profile",
"Post your properties and connect with roommates"
];

const findSteps = [
"Browse rooms or roommates by city",
"Contact the roommate or landlord",
"Move into your new shared space"
];

const popularProperties = [
  {
    title: "Spacious 2BHK in Bandra",
    city: "Mumbai",
    rent: "₹18,000",
    period: "/mo",
    type: "Apartment",
    image: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
    amenities: ["WiFi", "AC", "Parking"],
    rating: 4.8,
    reviews: 42,
    isVerified: true,
    isHot: true,
    beds: 2,
    baths: 1,
    sqft: "950 sq.ft"
  },
  {
    title: "Modern Studio near Hinjewadi",
    city: "Pune",
    rent: "₹12,500",
    period: "/mo",
    type: "Studio",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    amenities: ["Furnished", "Gym", "WiFi"],
    rating: 4.6,
    reviews: 28,
    isVerified: true,
    isHot: false,
    beds: 1,
    baths: 1,
    sqft: "550 sq.ft"
  },
  {
    title: "Cozy Room in Hitech City",
    city: "Hyderabad",
    rent: "₹9,000",
    period: "/mo",
    type: "Shared Room",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    amenities: ["Laundry", "Kitchen", "WiFi"],
    rating: 4.5,
    reviews: 19,
    isVerified: false,
    isHot: false,
    beds: 1,
    baths: 1,
    sqft: "320 sq.ft"
  },
  {
    title: "Premium Flat in Nashik Road",
    city: "Nashik",
    rent: "₹8,500",
    period: "/mo",
    type: "Apartment",
    image: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg",
    amenities: ["Balcony", "AC", "Parking"],
    rating: 4.7,
    reviews: 35,
    isVerified: true,
    isHot: true,
    beds: 2,
    baths: 1,
    sqft: "850 sq.ft"
  },
  {
    title: "Luxury 1BHK in Andheri",
    city: "Mumbai",
    rent: "₹22,000",
    period: "/mo",
    type: "Apartment",
    image: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    amenities: ["Pool", "Gym", "Security"],
    rating: 4.9,
    reviews: 56,
    isVerified: true,
    isHot: true,
    beds: 1,
    baths: 1,
    sqft: "680 sq.ft"
  }
];

const filteredProperties = propertyFilter === "All" 
  ? popularProperties 
  : popularProperties.filter(p => p.city === propertyFilter);

return(

<div className="home">

{/* NAVBAR */}

<HomeNavbar onLoginClick={() => setShowLogin(true)} onRegisterClick={() => setShowRegister(true)} />


{/* HERO */}

<section className="hero">

<div className="hero-text">

<h1>Find Your Perfect Roommate Match</h1>

<p>
Roomify connects students and professionals to
find safe, verified, and affordable shared living spaces — effortlessly.
</p>

<button
className="hero-btn"
onClick={()=>setShowRegister(true)}
>
Start Your Journey →
</button>

</div>

<div className="hero-img">

<img
src="https://cdn-icons-png.flaticon.com/512/706/706830.png"
alt="roommate"
/>

</div>

</section>


{/* CITIES */}

<section className="cities">

<h2>Popular Cities</h2>

<div onClick={()=>setShowRegister(true)} className="city-grid">

{cities.map((city, index) => {
  const imgIds = ["2409953", "439391", "1051075", "210243", "460672", "374870"];
  const imgId = imgIds[index % imgIds.length];
  
  return (
    <div key={index} className="city-card">
      <img src={`https://images.pexels.com/photos/${imgId}/pexels-photo-${imgId}.jpeg`} alt={city} />
      <h3>{city}</h3>
    </div>
  );
})}

</div>

</section>

{/* EXPLORE ROOMS */}

<section className="rooms">

<h2>Explore Rooms</h2>

<div onClick={()=>setShowRegister(true)} className="room-slider">

<div className="room-card">
<img src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"/>
<p>Modern Apartment</p>
</div>

<div className="room-card">
<img src="https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg"/>
<p>Luxury Bedroom</p>
</div>

<div className="room-card">
<img src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"/>
<p>Shared Living Room</p>
</div>

<div className="room-card">
<img src="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg"/>
<p>Budget Friendly Room</p>
</div>

</div>

</section>

{/* POPULAR PROPERTIES — SHORT & SWEET */}

<section className="pp-section">
  <div className="pp-header">
    <div className="pp-title-row">
      <div>
        <h2>Popular Properties</h2>
        <p>Trending spaces our community loves</p>
      </div>
      <button className="pp-browse-all" onClick={()=>setShowRegister(true)}>View All →</button>
    </div>
  </div>

  <div onClick={()=>setShowRegister(true)} className="pp-showcase">
    {popularProperties.slice(0, 4).map((property, index) => (
      <div key={index} className="pp-card-container">
        <div className="pp-showcase-card" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="pp-img-wrapper">
            <img src={`${property.image}?auto=compress&cs=tinysrgb&w=600`} alt={property.title} />
            <div className="pp-showcase-overlay"></div>
            {property.isHot && <span className="pp-hot-tag">Trending 🔥</span>}
            <div className="pp-price-float">
              <span>{property.rent}</span>
              <small>{property.period}</small>
            </div>
          </div>
          
          <div className="pp-card-content">
            <span className="pp-type-label">{property.type}</span>
            <h3>{property.title}</h3>
            <div className="pp-loc">
              <span>📍 {property.city}</span>
              <span className="pp-rating">⭐ {property.rating}</span>
            </div>
            
            <div className="pp-features">
              <span>🛏️ {property.beds} Bed</span>
              <span>🚿 {property.baths} Bath</span>
              <span>📏 {property.sqft}</span>
            </div>
            
            <button className="pp-view-btn">Check Availability</button>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

<section className="why">

<h2>Why Choose Roomify</h2>

<div className="why-grid">

<div className="why-card">
  <div className="why-icon-circle">🛡️</div>
  <h3>Verified Users</h3>
  <p>Every profile undergoes a strict verification process to ensure your safety and trust.</p>
</div>

<div className="why-card">
  <div className="why-icon-circle">🎯</div>
  <h3>Smart Matching</h3>
  <p>Our AI-driven algorithm connects you with roommates based on lifestyle, habits, and shared interests.</p>
</div>

<div className="why-card">
  <div className="why-icon-circle">💬</div>
  <h3>Secure Chat</h3>
  <p>Communicate directly and safely through our built-in real-time messaging system.</p>
</div>

</div>

</section>


{/* HOW IT WORKS */}

<section className="how">

<h2 className="how-title">How It Works</h2>

<div className="tabs">

<button
className={activeTab==="rent" ? "tab active" : "tab"}
onClick={()=>setActiveTab("rent")}
>
Rent a Room
</button>

<button
className={activeTab==="find" ? "tab active" : "tab"}
onClick={()=>setActiveTab("find")}
>
Find a Room
</button>

</div>

<div className="how-container">

<div className="how-steps">

{(activeTab==="rent"?rentSteps:findSteps).map((step,i)=>(
<div key={i} className="step-card">

<div className="step-number">{i+1}</div>

<p>{step}</p>

</div>
))}

<button
className="start"
onClick={()=>setShowRegister(true)}
>
Get Started →
</button>

</div>

<div className="how-image">

<img
src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
alt="illustration"
/>

</div>

</div>

</section>

{/* SUBSCRIPTION INFO */}

<section className="subscription">
  <div className="subscription-banner">
    <div className="banner-content">
      <h2>Unlock Roomify <span>Pro</span></h2>
      <p>Take your roommate search to the next level. Get unlimited messaging, verified badges, and priority placement.</p>
      <button className="pro-btn" onClick={()=>setShowRegister(true)}>View Plans <span className="arrow">→</span></button>
    </div>
    <div className="banner-illustration">
      <div className="glass-card">
        <div className="badge">✓ Verified</div>
        <div className="badge msg">💬 Unlimited Chats</div>
      </div>
    </div>
  </div>
</section>


{/* CTA */}

<section className="cta">

<h2>Ready to find your perfect roommate?</h2>

<button
onClick={()=>setShowRegister(true)}
>
Create Free Account
</button>

</section>


{/* HOME FOOTER */}

<footer className="home-footer">

<div className="home-footer-grid">

<div>
<div className="footer-brand">Roomify</div>
<p>
Find trusted roommates and shared rooms based on
your lifestyle and preferences. Safe, smart, and simple.
</p>
</div>

<div>
<h3>Platform</h3>
<ul>
<li>Dashboard</li>
<li>Find Roommate</li>
<li>Profile</li>
<li>Requests</li>
</ul>
</div>

<div>
<h3>Features</h3>
<ul>
<li>Room Matching</li>
<li>Preference Filter</li>
<li>Chat System</li>
<li>Secure Requests</li>
</ul>
</div>

<div>
<h3>Contact Us</h3>
<p>Pune, Maharashtra</p>
<p>+91 9876543210</p>
<p>support@roomify.com</p>
</div>

</div>

<div className="home-footer-bottom">
<p>© 2026 Roomify. All rights reserved.</p>
</div>

</footer>


{showLogin && (
  <Login 
    onClose={() => setShowLogin(false)} 
    onSwitch={() => { setShowLogin(false); setShowRegister(true); }} 
  />
)}

{showRegister && (
  <Registration 
    onClose={() => setShowRegister(false)} 
    onSwitch={() => { setShowRegister(false); setShowLogin(true); }} 
  />
)}

</div>

);

}
