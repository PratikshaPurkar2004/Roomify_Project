import React from "react";
import "../styles/Subscription.css";

function Subscription() {
  return (
    <div className="sub-container">

      <h1 className="sub-title">Choose Your Plan</h1>

      <p className="sub-text">
        Unlock unlimited chat with roommates
      </p>

      <div className="sub-grid">

        {/* Monthly Plan */}
        <div className="sub-card">

          <h3>Monthly Plan</h3>

          <h2>₹199</h2>

          <ul>
            <li>Unlimited Chat</li>
            <li>Verified Profiles</li>
            <li>Email Support</li>
          </ul>

          <button className="sub-btn">
            Subscribe Now
          </button>

        </div>

        {/* Yearly Plan */}
        <div className="sub-card popular">

          <span className="tag">Most Popular</span>

          <h3>Yearly Plan</h3>

          <h2>₹1999</h2>

          <ul>
            <li>Unlimited Chat</li>
            <li>Verified Profiles</li>
            <li>Priority Support</li>
          </ul>

          <button className="sub-btn">
            Subscribe Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default Subscription;
