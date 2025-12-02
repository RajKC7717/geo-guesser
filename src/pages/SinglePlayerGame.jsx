import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SinglePlayerGame.css";
import logo from "../assets/india.jpeg.png";
import { FaCog, FaArrowLeft } from "react-icons/fa";
import SettingsPanel from "../components/SettingsPanel";
import axios from "axios";

const SinglePlayerGame = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [ign, setIgn] = useState("Guest");
  const [rounds, setRounds] = useState(5);
  const [timePerRound, setTimePerRound] = useState("No Time Limit");

  useEffect(() => {
    const storedIGN = localStorage.getItem("ign") || `Guest${Math.floor(1000 + Math.random() * 9000)}`;
    setIgn(storedIGN);
    localStorage.setItem("ign", storedIGN);

    const storedRounds = localStorage.getItem("rounds") || 5;
    const storedTime = localStorage.getItem("timePerRound") || "No Time Limit";
    setRounds(parseInt(storedRounds));
    setTimePerRound(storedTime);
  }, []);

  const startGame = async () => {
    setLoading(true);
    setError("");

    const requestData = {
      mode: "Singleplayer",
      players: [{ ign, score: 0 }], // Corrected to align with updated schema
      totalRounds: rounds,
      timePerRound: timePerRound === "No Time Limit" ? "No Time Limit" : parseInt(timePerRound),
    };

    // 🔍 Debugging Log
    console.log("Request Data Sent:", requestData);

    try {
      const response = await axios.post("http://localhost:5000/api/gamesessions", requestData);

      navigate(`/game/${response.data.newGameSession.gameID}`,);
    } catch (err) {
      console.error("[Start Game Error]:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to start game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="singleplayer-container">
      <h1 className="singleplayer-title">Single Player Mode</h1>
      <img src={logo} alt="Game Logo" className="singleplayer-logo" />
      <div className="singleplayer-ign">IGN - {ign}</div>
      <div className="singleplayer-buttons">
        <button className="game-button" onClick={startGame} disabled={loading}>
          {loading ? "Starting..." : "Start Game"}
        </button>
        <button className="game-button" onClick={() => navigate("/gamesettings")}>
          Game Settings
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}
    </div>
    
  );
};

export default SinglePlayerGame;
