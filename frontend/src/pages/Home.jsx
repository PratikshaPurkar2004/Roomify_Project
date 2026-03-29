import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

import Login from "./auth/Login";
import Registration from "./auth/Registration";

export default function Home() {

const navigate = useNavigate();
const [showLogin, setShowLogin] = useState(false);
const [showRegister, setShowRegister] = useState(false);
const [activeTab,setActiveTab] = useState("rent");
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
      // Fallback to static cities if API fails
      setCities(['Mumbai', 'Pune', 'Nashik', 'Hyderabad']);
    }
  };
  fetchCities();
}, []);

const rentSteps = [
"Fill up a form with the basic details about your apartment",
"Sign up and complete your profile",
"Post your properties and connect with roomamtes"
];

const findSteps = [
"Browse rooms or roommates by city",
"Contact the roommate or landlord",
"Move into your new shared space"
];

const popularProfiles = [
  {
    name: "Aanya Sharma",
    city: "Mumbai",
    description: "Looking for a quiet and friendly roommate near Bandra.",
    image: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg",
    popularity: 98,
    views: 452,
    isVerified: true,
    tags: ["Student", "Non-Smoker"]
  },
  {
    name: "Rohan Mehta",
    city: "Pune",
    description: "Young professional seeking a flatmate in Hinjewadi.",
    image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg",
    popularity: 91,
    views: 389,
    isVerified: true,
    tags: ["Designer", "Night Owl"]
  },
  {
    name: "Neha Kulkarni",
    city: "Hyderabad",
    description: "Friendly and social person looking for a shared apartment.",
    image: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg",
    popularity: 87,
    views: 344,
    isVerified: false,
    tags: ["IT Prof.", "Pet Lover"]
  },
  {
    name: "Karan Patel",
    city: "Nashik",
    description: "Clean and organized person seeking a comfortable stay.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    popularity: 82,
    views: 298,
    isVerified: true,
    tags: ["Banker", "Early Bird"]
  }
];

return(

<div className="home">

{/* NAVBAR */}

<nav className="navbar">

<div className="logo">Roomify</div>

<div className="nav-buttons">
<button onClick={()=>setShowLogin(true)} className="login">Login</button>
<button onClick={()=>setShowRegister(true)} className="signup">Get Started</button>
</div>

</nav>


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
  // Use sequential placeholder images for cities
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

{/* ROOM PREVIEW */}

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

<section className="popular-profiles">

<h2>Popular Profiles</h2>
<p>These roommate profiles are currently the most viewed and highly rated by our community.</p>

<div onClick={()=>setShowRegister(true)} className="profile-grid">
  {popularProfiles.map((profile, index) => (
    <div key={index} className="profile-card-minimal">
      <div className="profile-avatar">
        <img src={`${profile.image}?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200`} alt={profile.name} />
      </div>
      <div className="profile-info-minimal">
        <h3>{profile.name} {profile.isVerified && <span className="verified-dot"></span>}</h3>
        <p className="profile-city-minimal">{profile.city}</p>
        
        <div className="profile-tags-minimal">
          {profile.tags.slice(0, 2).map((tag, i) => <span key={i} className="tag-minimal">{tag}</span>)}
        </div>

        <button className="profile-connect-btn">Connect Now</button>
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
