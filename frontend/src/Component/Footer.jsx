import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="home-footer dashboard-footer">
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
            <li onClick={() => navigate('/dashboard')}>Dashboard</li>
            <li onClick={() => navigate('/dashboard/find-roommates')}>Find Roommate</li>
            <li onClick={() => navigate('/dashboard/profile')}>Profile</li>
            <li onClick={() => navigate('/dashboard/requests')}>Requests</li>
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
        <div className="footer-bottom-links" style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ fontSize: '13px', cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ fontSize: '13px', cursor: 'pointer' }}>Contact Support</span>
        </div>
        <p>© 2026 Roomify. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
