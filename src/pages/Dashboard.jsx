import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import logo from "../assets/india.jpeg.png";
import { FaCog, FaArrowLeft } from "react-icons/fa";
import SettingsPanel from "../components/SettingsPanel"; // Import settings panel

const Dashboard = () => {
  const navigate = useNavigate();
  const [ign, setIgn] = useState("");
  const [showSettings, setShowSettings] = useState(false); // State for settings panel

  useEffect(() => {
    const storedIGN = localStorage.getItem("ign");
    if (storedIGN) {
      setIgn(storedIGN);
    } else {
      const guestID = `Guest${Math.floor(1000 + Math.random() * 9000)}`;
      setIgn(guestID);
      localStorage.setItem("ign", guestID);
    }
  }, []);

  const handleMultiplayerClick = () => {
    if (ign.startsWith("Guest")) {
      alert("Multiplayer is only available for registered players. Please log in.");
    } else {
      navigate("/multiplayer");
    }
  };

  return (
    <div className="dashboard">
      {/* Title */}
      <h1 className="dashboard-title">Select Game Mode</h1>

      {/* Logo */}
      <img src="../assets/india.jpeg.png" alt="Game Logo" className="dashboard-logo" />

      {/* IGN Display */}
      <div className="dashboard-ign">IGN - {ign}</div>

      {/* Buttons */}
      <div className="dashboard-buttons">
        <button className="game-button" onClick={() => navigate("/singleplayer")}>
          Single Player
        </button>
        <button className="game-button" onClick={handleMultiplayerClick}>
          Multiplayer
        </button>
      </div>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/")}>
        <FaArrowLeft className="back-icon" />
      </button>

      {/* Settings Button (toggles panel) */}
      <button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
        <FaCog className="settings-icon" />
      </button>

      {/* Settings Panel (only show if state is true) */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Dashboard;
