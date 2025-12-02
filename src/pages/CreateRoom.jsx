// CreateRoom.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/CreateRoom.css";
import { io } from "socket.io-client";

const CreateRoom = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams(); // get roomCode from URL

  const storedIGN = localStorage.getItem("ign");
  const socketRef = useRef();

  const [rounds, setRounds] = useState(5);
  const [timePerRound, setTimePerRound] = useState(30);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!storedIGN) {
      navigate("/dashboard");
      return;
    }

    // Connect socket only once
    socketRef.current = io("http://localhost:5000");

    // Join the room
    socketRef.current.emit("joinRoom", { roomID: roomCode, ign: storedIGN });

    // Update room data
    socketRef.current.on("roomJoined", ({ playersInRoom }) => {
      setPlayers(playersInRoom);
    });

    socketRef.current.on("updateRoomPlayers", (playersInRoom) => {
      setPlayers(playersInRoom);
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomCode, storedIGN, navigate]);

  const handleStartGame = () => {
    socketRef.current.emit("startGame", {
      roomID: roomCode,
      settings: { rounds, timePerRound },
    });

    navigate(`/game/${roomCode}`);
  };

  return (
    <div className="create-room-container">
      <h2>{storedIGN}'s Room</h2>
      <p className="room-id">Room ID: <strong>{roomCode}</strong></p>

      <div className="panels">
        {/* Panel 1 - Players */}
        <div className="players-panel">
          <h3>Players</h3>
          <ul>
            {Array.isArray(players) && players.length > 0 ? (
              players.map((player, index) => (
                <li key={index}>
                  {player.ign} {player.isHost && <span>(Host)</span>}
                  {player.isReady ? " - Ready" : " - Not Ready"}
                </li>
              ))
            ) : (
              <li>No players yet</li>
            )}
          </ul>
        </div>

        {/* Panel 2 - Game Settings */}
        <div className="settings-panel">
          <h3>Game Settings</h3>
          <label>Rounds:</label>
          <input
            type="number"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            min={1}
            max={10}
          />

          <label>Time per Round (s):</label>
          <input
            type="number"
            value={timePerRound}
            onChange={(e) => setTimePerRound(Number(e.target.value))}
            min={10}
            max={120}
          />
        </div>
      </div>

      {players.length > 1 && (
        <button className="start-game-button" onClick={handleStartGame}>
          Start Game
        </button>
      )}

      <button className="exit-room-button" onClick={() => navigate("/multiplayer")}>
        Exit Room
      </button>
    </div>
  );
};

export default CreateRoom;
