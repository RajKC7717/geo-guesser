import express from "express";
import { v4 as uuidv4 } from "uuid";
import GameSession from "../models/GameSession.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { mode, players, totalRounds, timePerRound } = req.body;

    const finalTimePerRound = timePerRound === "No Time Limit" ? "No Time Limit" : parseInt(timePerRound);

    if (!mode || !players || !totalRounds || finalTimePerRound === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gameID = uuidv4();

    const newGameSession = new GameSession({
      gameID,
      mode,
      players,
      totalRounds,
      timePerRound: finalTimePerRound,
      currentRound: 1,
      status: "Active",
    });

    await newGameSession.save();
    res.status(201).json({
      message: "Game session created successfully",
      newGameSession,
    });
  } catch (error) {
    console.error("[Game Session Creation Error]:", error);
    res.status(500).json({
      message: "Server error during game session creation",
      error: error.message,
    });
  }
});

// Fetch all active game sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await GameSession.find({ status: "Active" });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("[Fetching Sessions Error]:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch a specific game session by gameID
router.get("/:gameID", async (req, res) => {
  try {
    const { gameID } = req.params;
    const session = await GameSession.findOne({ gameID });

    if (!session) {
      return res.status(404).json({ message: "Game session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error("[Fetching Single Session Error]:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🚨 New DELETE route for ending a game session
router.delete("/:gameID", async (req, res) => {
  try {
    const { gameID } = req.params;
    const deletedSession = await GameSession.findOneAndDelete({ gameID });

    if (!deletedSession) {
      return res.status(404).json({ message: "Game session not found" });
    }

    res.status(200).json({ message: "Game session ended successfully" });
  } catch (error) {
    console.error("[Delete Session Error]:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
