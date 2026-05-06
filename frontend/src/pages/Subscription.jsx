import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Subscription.css";

function Subscription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState('method');
  const [paymentMethod, setPaymentMethod] = useState('');

  const startPayment = (planName, amount) => {
    setSelectedPlan({ name: planName, amount });
    setShowPayment(true);
    setPaymentStep('method');
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
      <div className="sub-container page-container">
        <div className="sub-bg-shape sub-shape-1"></div>
        <div className="sub-bg-shape sub-shape-2"></div>

        {toastMessage && (
          <div className="glass-toast">
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="sub-content">
          <div className="checkout-layout-real">
             {/* Left: Payment Methods */}
             <div className="checkout-left">
                <button className="back-link-real" onClick={() => { if(paymentStep==='details') setPaymentStep('method'); else setShowPayment(false); }}>
                   ← {paymentStep==='details' ? 'Back to methods' : 'Back to plans'}
                </button>
                <h2 className="checkout-title-real">Secure Checkout</h2>
                
                {paymentStep === 'method' ? (
                   <div className="method-grid-real">
                      <div className="method-card-real" onClick={() => { setPaymentMethod('UPI'); setPaymentStep('details'); }}>
                         <div className="method-icon-real">📲</div>
                         <div className="method-info-real">
                            <span className="method-name-real">UPI Transfer</span>
                            <span className="method-desc-real">GPay, PhonePe, Paytm</span>
                         </div>
                      </div>
                      <div className="method-card-real" onClick={() => { setPaymentMethod('Card'); setPaymentStep('details'); }}>
                         <div className="method-icon-real">💳</div>
                         <div className="method-info-real">
                            <span className="method-name-real">Card Payment</span>
                            <span className="method-desc-real">Visa, Mastercard, RuPay</span>
                         </div>
                      </div>
                      <div className="method-card-real" onClick={() => { setPaymentMethod('NetBanking'); setPaymentStep('details'); }}>
                         <div className="method-icon-real">🏦</div>
                         <div className="method-info-real">
                            <span className="method-name-real">Net Banking</span>
                            <span className="method-desc-real">All major Indian banks</span>
                         </div>
                      </div>
                   </div>
                ) : (
                   <div className="details-form-real">
                      <h4 className="details-subtitle-real">Pay using {paymentMethod}</h4>
                      
                      {paymentMethod === 'UPI' && (
                         <div className="input-field-real">
                            <label>UPI ID</label>
                            <input type="text" placeholder="e.g. mobile@upi" />
                            <button className="pay-now-btn-real" onClick={() => handleConfirmPayment("UPI")}>Pay ₹{selectedPlan.amount}</button>
                         </div>
                      )}

                      {paymentMethod === 'Card' && (
                         <div className="input-field-real">
                            <label>Card Details</label>
                            <input type="text" placeholder="Card Number" className="mb-10" />
                            <div className="input-row-real">
                               <input type="text" placeholder="MM/YY" />
                               <input type="password" placeholder="CVV" />
                            </div>
                            <button className="pay-now-btn-real" onClick={() => handleConfirmPayment("Card")}>Pay ₹{selectedPlan.amount}</button>
                         </div>
                      )}

                      {paymentMethod === 'NetBanking' && (
                         <div className="input-field-real">
                            <label>Choose Bank</label>
                            <select className="mb-20">
                               <option>HDFC Bank</option>
                               <option>SBI</option>
                               <option>ICICI Bank</option>
                               <option>Axis Bank</option>
                            </select>
                            <button className="pay-now-btn-real" onClick={() => handleConfirmPayment("NetBanking")}>Proceed to Bank</button>
                         </div>
                      )}
                   </div>
                )}
                
                {loading && (
                   <div className="payment-loading-real">
                      <div className="chat-spinner"></div>
                      <p>Authorizing transaction...</p>
                   </div>
                )}

                <div className="security-footer-real">
                   🛡️ Secured by 256-bit SSL Encryption
                </div>
             </div>

             {/* Right: Order Summary */}
             <div className="checkout-right">
                <div className="summary-card-real">
                   <h3 className="summary-title-real">Order Summary</h3>
                   <div className="summary-item-real">
                      <span className="item-label-real">{selectedPlan.name}</span>
                      <span className="item-price-real">₹{selectedPlan.amount}</span>
                   </div>
                   <div className="summary-item-real">
                      <span className="item-label-real">Platform Fee</span>
                      <span className="item-price-real">₹0.00</span>
                   </div>
                   <div className="summary-divider-real"></div>
                   <div className="summary-total-real">
                      <span>Total Due</span>
                      <span>₹{selectedPlan.amount}</span>
                   </div>
                   <div className="summary-perks-real">
                      <p>✨ Instant activation</p>
                      <p>✨ Ad-free experience</p>
                      <p>✨ Priority customer support</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-container page-container">
      <div className="sub-bg-shape sub-shape-1"></div>
      <div className="sub-bg-shape sub-shape-2"></div>


      {toastMessage && (
        <div className="glass-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="sub-content">
        <h1 className="sub-title">Upgrade to Premium</h1>
        <p className="sub-text">
          Unlock unlimited chat with your accepted roommates and find your perfect home faster.
        </p>

        <div className="sub-grid">
          {/* Basic Plan */}
          <div className="sub-card">
            <h3>Basic</h3>
            <div className="sub-price">Free</div>
            <ul>
              <li><span className="check-icon">✓</span> Browse Rooms</li>
              <li><span className="check-icon">✓</span> Limited Contact</li>
              <li><span className="check-icon">✓</span> Standard Support</li>
            </ul>
            <button className="sub-btn sub-btn-basic" onClick={() => navigate("/dashboard")}>
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="sub-card popular">
            <span className="tag">MOST POPULAR</span>
            <h3>Roomify Pro</h3>
            <div className="sub-price">₹499<span>/mo</span></div>
            <ul>
              <li><span className="check-icon">✓</span> Unlimited Chats</li>
              <li><span className="check-icon">✓</span> Verified Badge ✓</li>
              <li><span className="check-icon">✓</span> Priority Listing</li>
              <li><span className="check-icon">✓</span> AI Smart Matches</li>
            </ul>
            <button className="sub-btn sub-btn-premium" onClick={() => startPayment("Roomify Pro", 499)}>
              Get Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
