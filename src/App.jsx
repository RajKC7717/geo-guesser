import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import GuestMode from "./pages/GuestMode";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import SinglePlayerGame from "./pages/SinglePlayerGame";
import GameSettings from "./pages/GameSettings";
import GamePlay from "./pages/GamePlay";
import Multiplayer from "./pages/Multiplayer";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Leaderboard from "./pages/LeaderBoard"; // Import Leaderboard page

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/guest" element={<GuestMode />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/singleplayer" element={<SinglePlayerGame />} />
      <Route path="/gamesettings" element={<GameSettings />} />
      <Route path="/game/:gameID" element={<GamePlay />} />
      <Route path="/multiplayer" element={<Multiplayer />} />
      <Route path="/room/:roomCode" element={<CreateRoom />} />
      <Route path="/multiplayer/join" element={<JoinRoom />} />
      <Route path="/multiplayer/leaderboard" element={<Leaderboard />} /> {/* Updated route for leaderboard */}
    </Routes>
  );
};

export default App;
