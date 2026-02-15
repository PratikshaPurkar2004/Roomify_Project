import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <div className="header">

      <div className="header-left">
        <h2>🏠 Roomify</h2>
      </div>

      <div className="header-right">
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="header-avatar"
        />
      </div>

    </div>
  );
}

export default Header;
