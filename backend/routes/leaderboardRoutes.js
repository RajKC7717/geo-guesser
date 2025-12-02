import mongoose from "mongoose";
import express from "express";
import Leaderboard from "../models/Leaderboard.js";
import Player from "../models/Player.js";

const router = express.Router();

// 📌 Get the top 10 players (Default sorting: Wins → Total Score)
router.get("/", async (req, res) => {
  try {
    const topPlayers = await Leaderboard.find()
      .sort({ wins: -1, totalScore: -1 }) // Sort by Wins first, then by Total Score
      .limit(10)
      .populate("playerID", "ign"); // Populate IGN from Player model

    res.status(200).json(topPlayers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Get the leaderboard with different ranking filters
router.get("/filter", async (req, res) => {
  try {
    const { type } = req.query;

    let sortCriteria = {};
    if (type === "score") {
      sortCriteria = { totalScore: -1 };
    } else if (type === "bestTime") {
      sortCriteria = { bestAccurateGuessTime: 1 }; // Fastest time first
    } else {
      sortCriteria = { wins: -1, totalScore: -1 }; // Default: Wins → Score
    }

    const filteredPlayers = await Leaderboard.find()
      .sort(sortCriteria)
      .limit(10)
      .populate("playerID", "ign");

    res.status(200).json(filteredPlayers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Get a specific player's ranking and stats
router.get("/player/:playerID", async (req, res) => {
    try {
      const { playerID } = req.params;
  
      // Ensure playerID is treated as ObjectId
      const objectId = new mongoose.Types.ObjectId(playerID);
  
      const playerStats = await Leaderboard.findOne({ playerID: objectId })
        .populate("playerID", "ign"); 
  
      if (!playerStats) {
        return res.status(404).json({ message: "Player not found in leaderboard" });
      }
  
      res.json(playerStats);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  


// 📌 Search players by IGN
router.get("/search", async (req, res) => {
  try {
    const { ign } = req.query;
    if (!ign) {
      return res.status(400).json({ message: "IGN is required" });
    }

    const players = await Leaderboard.find({ ign: { $regex: new RegExp(ign, "i") } })
      .sort({ wins: -1, totalScore: -1 })
      .limit(10)
      .populate("playerID", "ign");

    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
