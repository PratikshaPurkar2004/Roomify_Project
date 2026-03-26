import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Subscription.css";

function Subscription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const startPayment = (planName, amount) => {
    setSelectedPlan({ name: planName, amount });
    setShowPayment(true);
  };

  const handleConfirmPayment = async (method) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setToastMessage("Please login first!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/subscriptions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: userId, 
          plan_name: selectedPlan.name, 
          amount: selectedPlan.amount,
          payment_method: method 
        })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("subscribed", "true");
        setToastMessage(`Payment successful via ${method}! 🎉`);
        setTimeout(() => {
          navigate("/dashboard/chat");
        }, 1500);
      } else {
        setToastMessage(data.message || "Payment failed.");
      }
    } catch (err) {
      setToastMessage("Error processing payment.");
    }

    setLoading(false);
    setTimeout(() => setToastMessage(""), 3000);
  };

  if (showPayment) {
    return (
      <div className="sub-container">
        {toastMessage && (
          <div className="custom-toast glass-toast">
            <span>{toastMessage}</span>
          </div>
        )}
        <div className="payment-box glass-panel">
          <button className="back-btn" onClick={() => setShowPayment(false)}>← Back</button>
          <h2 className="payment-title">Select Payment Method</h2>
          <p className="payment-plan">Paying <strong>₹{selectedPlan.amount}</strong> for <strong>{selectedPlan.name}</strong></p>
          
          <div className="payment-options">
            <div className="payment-option" onClick={() => handleConfirmPayment("PhonePe")}>
              <div className="option-icon">🟣</div>
              <span>PhonePe</span>
            </div>
            <div className="payment-option" onClick={() => handleConfirmPayment("Google Pay")}>
              <div className="option-icon">🔵</div>
              <span>Google Pay</span>
            </div>
          </div>
          
          {loading && <p className="processing-text">Processing your payment securely...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="sub-container">

      {toastMessage && (
        <div className="custom-toast glass-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      <h1 className="sub-title">Choose Your Plan</h1>

      <p className="sub-text">
        Unlock unlimited chat with your accepted roommates
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

          <button
            className="sub-btn"
            onClick={() => startPayment("Monthly Plan", 199)}
          >
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

          <button
            className="sub-btn"
            onClick={() => startPayment("Yearly Plan", 1999)}
          >
            Subscribe Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default Subscription;
