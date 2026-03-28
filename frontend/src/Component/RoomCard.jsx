import React from "react";
import "../styles/RoomCard.css";

function RoomCard({ room }) {
  const imageUrl = room.image_url ? `http://localhost:5000${room.image_url}` : room.image;
  
  return (
    <div className="horizontal-card">
      <img src={imageUrl || "https://images.unsplash.com/photo-1522770179533-24471fcdba45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={room.name} />
      <div className="card-info">
        <h3>{room.name || `Room in ${room.location}`}</h3>
        <p>{room.location}</p>
        <div className="card-details">
          <span>Rent ₹{room.rent}</span>
          <span>Looking for {room.gender || "Any"}</span>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
