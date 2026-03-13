import React from "react";
import "../styles/RoomCard.css";

function RoomCard({ room }) {
  return (
    <div className="horizontal-card">

      <img src={room.image} alt={room.name} />

      <div className="card-info">
        <h3>{room.name}</h3>
        <p>{room.location}</p>

        <div className="card-details">
          <span>Rent ₹{room.rent}</span>
          <span>Looking for {room.gender}</span>
        </div>
      </div>

    </div>
  );
}

export default RoomCard;
