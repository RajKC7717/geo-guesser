import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import logo from "../assets/india.jpeg.png";
import { FaCog, FaArrowLeft, FaGoogle, FaDiscord } from "react-icons/fa";
import SettingsPanel from "../components/SettingsPanel";

const SignUp = () => {
  const [name, setName] = useState("");
  const [ign, setIgn] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [ignStatus, setIgnStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navigate = useNavigate();

  // IGN Availability Check
  useEffect(() => {
    const trimmedIgn = ign.trim();

    if (trimmedIgn === "") {
      setIgnStatus("");
      return;
    }

    setLoading(true);
    const checkIGN = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/players/check-ign/${trimmedIgn.toLowerCase()}`);
        const data = await response.json();
        setIgnStatus(data.available ? "available" : "taken");
      } catch (error) {
        console.error("Error checking IGN:", error);
        setIgnStatus("");
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(checkIGN);
  }, [ign]);

  const isFormValid = name && ign && age && password && ignStatus === "available";

  const handleSignUp = async () => {
    if (!isFormValid) return;

    try {
      const response = await fetch("http://localhost:5000/api/players/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          ign: ign.trim().toLowerCase(),
          age: Number(age),
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error. Please try again.");
    }
  };

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  return (
    <div className="signup-container">
      <img src={logo} alt="Game Logo" className="signup-logo" />
      <h1 className="signup-title">Sign Up</h1>

      <div className="signup-panels">
        <div className="panel">
          <input
            type="text"
            placeholder="Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="ign-container">
            <input
              type="text"
              placeholder="IGN (Unique)"
              className="input-field"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
            />
            <span className={`ign-status ${ignStatus}`}>
              {loading
                ? "Checking..."
                : ignStatus === "available"
                ? "Available"
                : ignStatus === "taken"
                ? "Already Taken"
                : ""}
            </span>
          </div>

          <input
            type="number"
            placeholder="Age"
            className="input-field"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="panel">
          <button className="social-btn google">
            <FaGoogle className="social-icon" /> Sign Up with Google
          </button>
          <button className="social-btn discord">
            <FaDiscord className="social-icon" /> Sign Up with Discord
          </button>
        </div>
      </div>

      <button
        className={`signup-button ${isFormValid ? "visible" : ""}`}
        onClick={handleSignUp}
        disabled={!isFormValid}
      >
        Sign Up
      </button>

      <Link to="/" className="back-button">
        <FaArrowLeft className="back-icon" />
      </Link>

      <div className="settings-button" onClick={toggleSettings}>
        <FaCog className="settings-icon" />
      </div>

      {isSettingsOpen && <SettingsPanel />}
    </div>
  );
};

export default SignUp;
