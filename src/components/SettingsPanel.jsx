import React, { useState, useEffect } from "react";
import "../styles/SettingsPanel.css";

const SettingsPanel = ({ onClose = () => {} }) => {  // Default function to avoid errors
  const [language, setLanguage] = useState("English");
  const [soundOn, setSoundOn] = useState(true);

  // Close the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".settings-panel")) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="settings-panel">
      <h3 className="settings-title">Settings</h3>

      {/* Language Selector */}
      <div className="settings-option">
        <label>Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Marathi">Marathi</option>
          <option value="Bengali">Bengali</option>
        </select>
      </div>

      {/* Sound Toggle */}
      <div className="settings-option">
        <label>Sound:</label>
        <button onClick={() => setSoundOn(!soundOn)} className="sound-toggle">
          {soundOn ? "On 🔊" : "Off 🔇"}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
