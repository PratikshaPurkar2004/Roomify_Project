import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-col">
          <h2 className="logo">Roomify</h2>

          <p>
            Find trusted roommates and shared rooms based on
            your lifestyle and preferences.
          </p>

          
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h3>Platform</h3>
          <ul>
            <li>Dashboard</li>
            <li>Find Roommate</li>
            <li>Profile</li>
            <li>Requests</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h3>Features</h3>
          <ul>
            <li>Room Matching</li>
            <li>Preference Filter</li>
            <li>Chat System</li>
            <li>Secure Requests</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <p>Pune, Maharashtra</p>
          <p>+91 9876543210</p>
          <p>support@roomify.com</p>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>
        </div>

        <p>© 2026 Roomify. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
