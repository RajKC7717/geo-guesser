import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GameSettings.css";
import bg1 from "../assets/bg1.jpg"; // Make sure the path is correct

const GameSettings = () => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState(5);
  const [timePerRound, setTimePerRound] = useState("No Time Limit");

  // Load saved settings from localStorage
  useEffect(() => {
    const storedRounds = localStorage.getItem("rounds") || 5;
    const storedTime = localStorage.getItem("timePerRound") || "No Time Limit";
    setRounds(parseInt(storedRounds));
    setTimePerRound(storedTime);
  }, []);

  // Save settings and navigate back
  const saveSettings = () => {
    localStorage.setItem("rounds", rounds);
    localStorage.setItem("timePerRound", timePerRound);
    navigate("/singleplayer");
  };

  return (
    <div
      className="game-settings-container"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(224, 234, 252, 0.85), rgba(207, 222, 243, 0.85)), url(${bg1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="game-settings-title">Game Settings</h1>

      <div className="settings-form">
        <label className="settings-label">Rounds:</label>
        <input
          type="number"
          min="3"
          max="10"
          value={rounds}
          onChange={(e) => setRounds(e.target.value)}
          className="settings-input"
        />

        <label className="settings-label">Time Per Round:</label>
        <select
          value={timePerRound}
          onChange={(e) => setTimePerRound(e.target.value)}
          className="settings-input"
        >
          <option>No Time Limit</option>
          <option>3s</option>
          <option>20s</option>
          <option>30s</option>
          <option>45s</option>
          <option>60s</option>
          <option>90s</option>
          <option>120s</option>
        </select>

        <button className="settings-save-button" onClick={saveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default GameSettings;
