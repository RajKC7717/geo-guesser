import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/india.jpeg.png"; // Adjust path if needed
import { FaCog, FaArrowLeft, FaGoogle, FaDiscord } from "react-icons/fa";
import SettingsPanel from "../components/SettingsPanel"; // Import Settings Panel

const Login = () => {
  const [ign, setIgn] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // State for settings panel
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = () => {
    setShowButton(ign.trim() !== "" && password.trim() !== "");
  };

  // Handle Login
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/players/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ign, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("ign", data.ign); // Store IGN in localStorage
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setErrorMessage("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <img src={logo} alt="Game Logo" className="login-logo" />

      {/* Title */}
      <h1 className="login-title">Login</h1>

      {/* Login Panel */}
      <div className="login-panel">
        <input
          type="text"
          placeholder="IGN"
          className="input-field"
          value={ign}
          onChange={(e) => {
            setIgn(e.target.value);
            handleInputChange();
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            handleInputChange();
          }}
        />

        {/* Error Message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Separator */}
        <hr className="separator" />

        {/* Social Login Buttons */}
        <button className="social-btn google">
          <FaGoogle className="social-icon" /> Login with Google
        </button>
        <button className="social-btn discord">
          <FaDiscord className="social-icon" /> Login with Discord
        </button>
      </div>

      {/* Login Button (Appears when fields are filled) */}
      {showButton && (
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      )}

      {/* Back Button */}
      <Link to="/" className="back-button">
        <FaArrowLeft className="back-icon" />
      </Link>

      {/* Settings Button */}
      <div className="settings-button" onClick={() => setShowSettings(!showSettings)}>
        <FaCog className="settings-icon" />
      </div>

      {/* Settings Panel (Only shows when showSettings is true) */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Login;
