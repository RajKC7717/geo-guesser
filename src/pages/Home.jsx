import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import logo from "../assets/india.jpeg.png";
import { FaCog } from "react-icons/fa";
import SettingsPanel from "../components/SettingsPanel"; // Import settings panel

const Home = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="home-container">
      {/* Title */}
      <h1 className="title">Where In India?</h1>

      {/* Logo */}
      <img src={logo} alt="Game Logo" className="logo" />

      {/* Buttons */}
      <div className="button-container">
        <Link to="/signup" className="button signup">Sign Up</Link>
        <Link to="/login" className="button login">Login</Link>
        <Link to="/guest" className="button guest">Guest Mode</Link>
      </div>

      {/* Settings Button */}
      <div className="settings-button" onClick={toggleSettings}>
        <FaCog className="settings-icon" />
      </div>

      {/* Settings Panel (Appears when settings button is clicked) */}
      {isSettingsOpen && <SettingsPanel />}
    </div>
  );
};

export default Home;
