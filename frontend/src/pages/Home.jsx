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
const [showPlans, setShowPlans] = useState(false);
const [activeTab,setActiveTab] = useState("rent");
const [propertyFilter, setPropertyFilter] = useState("All");
const [cities, setCities] = useState([]);

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
  }
];

const [activeProperty, setActiveProperty] = useState(popularProperties[0]);

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

return(

<div className="home">

{/* NAVBAR */}

<HomeNavbar onLoginClick={() => setShowLogin(true)} onRegisterClick={() => setShowRegister(true)} />


{/* HERO */}

<section className="hero">

<div className="hero-text">

<h1>Find Your Perfect Rooms/Roommate.</h1>

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


{/* SIMPLE & SWEET PROPERTIES */}

<section className="simple-properties">
  <div className="sp-header">
    <h2>Popular Properties</h2>
    <p>Discover the most loved spaces.</p>
  </div>

  <div className="sp-grid">
    {popularProperties.slice(0, 4).map((prop, idx) => (
      <div key={idx} className="sp-card" onClick={()=>setShowRegister(true)}>
        <div className="sp-img-wrapper">
          <img src={prop.image} alt={prop.title} />
          <div className="sp-price">{prop.rent}<span>{prop.period}</span></div>
        </div>
        <div className="sp-info">
          <h3>{prop.title}</h3>
          <p>📍 {prop.city} • {prop.type}</p>
          <div className="sp-amenities">
            {prop.amenities && prop.amenities.map((amenity, i) => (
              <span key={i} className="sp-amenity">{amenity}</span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
  
  <div className="sp-footer">
    <button className="sp-view-all" onClick={()=>setShowRegister(true)}>Explore All Properties</button>
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
      <button className="pro-btn" onClick={() => setShowPlans(true)}>View Plans <span className="arrow">→</span></button>
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
<ul className="platform-col">
<li onClick={() => setShowRegister(true)}>Dashboard</li>
<li onClick={() => setShowRegister(true)}>Find Roommate</li>
<li onClick={() => setShowRegister(true)}>Profile</li>
<li onClick={() => setShowRegister(true)}>Requests</li>
</ul>
</div>

<div>
<h3>Features</h3>
<ul className="features-col">
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

{showPlans && (
  <div className="plans-modal-overlay" onClick={() => setShowPlans(false)}>
    <div className="plans-modal" onClick={e => e.stopPropagation()}>
      <button className="close-plan-btn" onClick={() => setShowPlans(false)}>✕</button>
      <div className="plans-modal-header">
        <h2>Choose Your Plan</h2>
        <p>Upgrade to Pro for more features and verified roommates.</p>
      </div>
      <div className="plans-cards-container">
        
        <div className="plan-card basic">
          <h3>Basic</h3>
          <div className="plan-price">Free</div>
          <ul className="plan-features">
            <li>Browse Rooms</li>
            <li>Limited Contact</li>
            <li>Standard Support</li>
          </ul>
          <button className="plan-select-btn" onClick={() => {setShowPlans(false); setShowRegister(true)}}>Select Basic</button>
        </div>

        <div className="plan-card pro">
          <div className="plan-badge">Most Popular</div>
          <h3>Roomify Pro</h3>
          <div className="plan-price">₹499<span>/mo</span></div>
          <ul className="plan-features">
            <li>Unlimited Chats</li>
            <li>Verified Badge ✓</li>
            <li>Priority Listing</li>
            <li>AI Smart Matches</li>
          </ul>
          <button className="plan-select-btn pro-select" onClick={() => {setShowPlans(false); setShowRegister(true)}}>Get Pro</button>
        </div>

      </div>
    </div>
  </div>
)}

</div>

);

}
