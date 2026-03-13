import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {

const navigate = useNavigate();
const [activeTab,setActiveTab] = useState("rent");

const rentSteps = [
"Fill up a form with the basic details about your apartment",
"Sign up and complete your profile",
"Post your listing and connect with seekers"
];

const findSteps = [
"Browse rooms or roommates by city",
"Contact the roommate or landlord",
"Move into your new shared space"
];

return(

<div className="home">

{/* NAVBAR */}

<nav className="navbar">

<div className="logo">Roomify</div>

<div className="nav-buttons">
<button onClick={()=>navigate("/login")} className="login">Login</button>
<button onClick={()=>navigate("/signup")} className="signup">Get Started</button>
</div>

</nav>


{/* HERO */}

<section className="hero">

<div className="hero-text">

<h1>Find Your Perfect Roommate</h1>

<p>
Roomify connects students and professionals to
find safe and affordable shared living spaces.
</p>

<button
className="hero-btn"
onClick={()=>navigate("/signup")}
>
Start Your Journey
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

<div className="city-grid">

<div className="city-card">
<img src="https://images.pexels.com/photos/2409953/pexels-photo-2409953.jpeg"/>
<h3>Mumbai</h3>
</div>

<div className="city-card">
<img src="https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg"/>
<h3>Pune</h3>
</div>

<div className="city-card">
<img src="https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg"/>
<h3>Nashik</h3>
</div>

<div className="city-card">
<img src="https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg"/>
<h3>Hyderabad</h3>
</div>

</div>

</section>


{/* ROOM PREVIEW */}

<section className="rooms">

<h2>Explore Rooms</h2>

<div className="room-slider">

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
onClick={()=>navigate("/signup")}
>
Get Started
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


{/* WHY ROOMIFY */}

<section className="why">

<h2>Why Choose Roomify</h2>

<div className="why-grid">

<div className="why-card">
<h3>Verified Users</h3>
<p>All users are verified for safe and trusted connections.</p>
</div>

<div className="why-card">
<h3>Smart Matching</h3>
<p>Find roommates based on lifestyle and preferences.</p>
</div>

<div className="why-card">
<h3>Easy Communication</h3>
<p>Chat directly with potential roommates.</p>
</div>

</div>

</section>


{/* CTA */}

<section className="cta">

<h2>Ready to find your roommate?</h2>

<button
onClick={()=>navigate("/register")}
>
Create Account
</button>

</section>




</div>

);

}
