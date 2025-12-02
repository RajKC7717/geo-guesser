import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Multiplayer.css";
import axios from "axios";
import io from "socket.io-client";


const Multiplayer = () => {
    const navigate = useNavigate();

    const storedIGN = localStorage.getItem("ign");
    const [playerIGN, setPlayerIGN] = useState(storedIGN || "Guest");

    const onCreateRoom = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/rooms", { ign: playerIGN });

            const roomId = res.data.roomID; // Make sure your backend sends this!         
            navigate(`/room/${roomId}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="multiplayer-page">
            <h1>Multiplayer Mode</h1>

            <div className="multiplayer-buttons">
                <button onClick={onCreateRoom}>Create Room</button>
                <button onClick={() => navigate("/multiplayer/join")}>Join Room</button>
                <button onClick={() => navigate("/multiplayer/leaderboard")}>Leaderboard</button>
            </div>
        </div>
    );
};

export default Multiplayer;
