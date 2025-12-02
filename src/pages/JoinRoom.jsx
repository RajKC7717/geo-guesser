import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/JoinRoom.css";

const socket = io("http://localhost:5000");

const JoinRoom = () => {
  const [roomID, setRoomID] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const storedIGN = localStorage.getItem("ign") || "Guest";

  useEffect(() => {
    socket.on("joinSuccess", ({ playersInRoom }) => {
      navigate(`/room/${roomID}`);
    });

    socket.on("joinFailure", (message) => {
      setError(message);
    });

    return () => {
      socket.off("joinSuccess");
      socket.off("joinFailure");
    };
  }, [navigate, roomID]);

  const handleJoinRoom = () => {
    if (!roomID || roomID.length !== 6) {
      setError("Enter a valid 6-digit Room ID");
      return;
    }

    socket.emit("joinRoom", { roomID, ign: storedIGN });
  };

  return (
    <div className="join-room-container">
      <h1>Join a Room</h1>
      <div className="join-room-form">
        <label htmlFor="roomID">Enter Room ID:</label>
        <input
          type="text"
          id="roomID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
          placeholder="Enter 6-digit room ID"
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleJoinRoom}>Join Room</button>
        <button onClick={() => navigate("/multiplayer")}>Back to Multiplayer</button>
      </div>
    </div>
  );
};

export default JoinRoom;
