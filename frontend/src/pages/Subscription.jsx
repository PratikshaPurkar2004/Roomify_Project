import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Subscription.css";
import { Check, ShieldCheck, CreditCard, Landmark, ArrowLeft, Loader2, CheckCircle2, Smartphone } from "lucide-react";
import axios from "axios";
import { API_URL } from "../api";

export default function Subscription() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('plans'); 
  const [paymentStatus, setPaymentStatus] = useState('idle'); 
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [status, setStatus] = useState({ subscribed: false, plan: 'Free' });
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/subscriptions/status/${userId}`);
        const data = await res.json();
        if (data.success) setStatus({ subscribed: data.subscribed, plan: data.plan_name });
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchStatus();
  }, [userId, navigate]);

  const handleConfirmPayment = async () => {
    if (!selectedMethod) return;
    setPaymentStatus('processing');
    setTimeout(async () => {
      try {
        const res = await axios.post(`${API_URL}/api/subscriptions/subscribe`, {
          user_id: userId, plan_name: selectedPlan.name, amount: selectedPlan.price, payment_method: selectedMethod
        });
        if (res.data.success) {
          setPaymentStatus('success');
          setStatus({ subscribed: true, plan: selectedPlan.name });
        } else {
          setPaymentStatus('idle');
          alert("Payment failed.");
        }
      } catch (err) { console.error(err); setPaymentStatus('idle'); }
    }, 2500);
  };

  if (isLoading) return <div className="sub-loader">Loading...</div>;

  // Inline styles to guarantee side-by-side cards even if CSS fails
  const gridStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '40px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', 'Outfit', sans-serif"
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '50px',
    padding: '60px 40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    width: '420px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', 'Outfit', sans-serif"
  };

  return (
    <div className="subscription-wrapper-unique">
      {paymentStatus === 'processing' && (
        <div className="payment-processing-overlay">
          <div className="processing-content">
            <Loader2 className="spinner-icon" size={60} />
            <h2>Securing Your Transaction</h2>
            <p>Please wait while we verify with your bank...</p>
          </div>
        </div>
      )}

      {paymentStatus === 'success' ? (
        <div className="payment-success-view">
          <div className="success-card-unique">
            <div className="success-icon-wrap"><CheckCircle2 size={80} color="#10b981" /></div>
            <h1>Payment Successful!</h1>
            <p>Congratulations! You are now a <strong>{selectedPlan?.name}</strong> member.</p>
            <div className="success-details-box">
               <div className="detail-line"><span>ID:</span> <span>#RM-{Math.floor(Math.random()*1000000)}</span></div>
               <div className="detail-line"><span>Paid:</span> <span>₹{selectedPlan?.price}</span></div>
            </div>
            <button className="success-home-btn" onClick={() => navigate('/dashboard/chat')}>Start Chatting Now</button>
          </div>
        </div>
      ) : currentStep === 'plans' ? (
        <div className="plans-step-view">
          <header className="sub-header-center">
            <h1 className="sub-main-title">Your Subscription</h1>
            <p className="sub-subtitle">{status.subscribed ? `Active: ${status.plan}` : "Upgrade to unlock unlimited features."}</p>
          </header>

          <div style={gridStyle} className="plans-grid-force">
            {/* Basic Card */}
            <div style={cardStyle} className="sub-plan-card">
              <h3 className="plan-title-head">Basic</h3>
              <div className="price-display-row">
                <span className="cur">₹</span><span className="val">199</span><span className="per">/mo</span>
              </div>
              <ul className="plan-features-list">
                 <li><Check size={18} /> Browse Rooms</li>
                 <li><Check size={18} /> Limited Contact</li>
                 <li><Check size={18} /> Standard Support</li>
              </ul>
              <button className="plan-btn-action secondary-btn" onClick={() => { setSelectedPlan({name:'Basic', price:199}); setCurrentStep('payment'); }}>
                 {status.plan === 'Basic' ? 'Current Plan' : 'Switch to Basic'}
              </button>
            </div>

            {/* Pro Card */}
            <div style={{...cardStyle, border: '2px solid #6366f1', background: '#fcfdff'}} className="sub-plan-card pro">
              <div className="most-popular-badge">MOST POPULAR</div>
              <h3 className="plan-title-head">Roomify Pro</h3>
              <div className="price-display-row">
                <span className="cur">₹</span><span className="val">499</span><span className="per">/mo</span>
              </div>
              <ul className="plan-features-list">
                 <li><Check size={18} /> Unlimited Chats</li>
                 <li><Check size={18} /> Verified Badge ✓</li>
                 <li><Check size={18} /> Priority Listing</li>
                 <li><Check size={18} /> AI Smart Matches</li>
              </ul>
              <button className="plan-btn-action primary-btn" onClick={() => { setSelectedPlan({name:'Roomify Pro', price:499}); setCurrentStep('payment'); }}>
                 {status.plan === 'Roomify Pro' ? 'Renew Pro' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="checkout-step-view">
           <div className="checkout-layout-dual">
              <div className="methods-selection-card">
                <button className="back-link-btn" onClick={() => setCurrentStep('plans')}><ArrowLeft size={16} /> Back to plans</button>
                <h2 className="check-title">Complete Your Upgrade</h2>
                <div className="methods-vertical-list">
                   <div className={`method-row-item ${selectedMethod === 'UPI' ? 'active' : ''}`} onClick={() => setSelectedMethod('UPI')}>
                      <Smartphone size={24} color="#6366f1" />
                      <div><strong>UPI Transfer</strong><span>Google Pay, PhonePe, Paytm</span></div>
                      {selectedMethod === 'UPI' && <Check size={20} color="#6366f1" />}
                   </div>
                   <div className={`method-row-item ${selectedMethod === 'Card' ? 'active' : ''}`} onClick={() => setSelectedMethod('Card')}>
                      <CreditCard size={24} color="#6366f1" />
                      <div><strong>Credit / Debit Card</strong><span>Visa, Mastercard, RuPay</span></div>
                      {selectedMethod === 'Card' && <Check size={20} color="#6366f1" />}
                   </div>
                   <div className={`method-row-item ${selectedMethod === 'NetBanking' ? 'active' : ''}`} onClick={() => setSelectedMethod('NetBanking')}>
                      <Landmark size={24} color="#10b981" />
                      <div><strong>Net Banking</strong><span>Secure login to your bank</span></div>
                      {selectedMethod === 'NetBanking' && <Check size={20} color="#6366f1" />}
                   </div>
                </div>
                {selectedMethod && <button className="finalize-pay-btn" onClick={handleConfirmPayment}>Pay ₹{selectedPlan?.price} Now</button>}
                <p className="ssl-secured"><ShieldCheck size={14} /> Secured by 256-bit SSL Encryption</p>
              </div>
              
              <div className="order-summary-sidebar">
                 <h3>Order Summary</h3>
                 <div className="summary-item"><span>{selectedPlan?.name}</span><span>₹{selectedPlan?.price}</span></div>
                 <div className="summary-item"><span>Platform Fee</span><span>₹0.00</span></div>
                 <div className="summary-total-row"><span>Total Due</span><span>₹{selectedPlan?.price}</span></div>
                 <ul className="perks-mini-list">
                    <li>✨ Instant activation</li>
                    <li>🚫 Ad-free experience</li>
                    <li>🎧 Priority support</li>
                 </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
