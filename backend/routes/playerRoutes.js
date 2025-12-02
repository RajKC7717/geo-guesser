import express from "express";
import Player from "../models/Player.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Check if IGN is available
router.get("/check-ign/:ign", async (req, res) => {
  try {
    const { ign } = req.params;
    const existingPlayer = await Player.findOne({ ign: ign.toLowerCase() });

    res.json({ available: !existingPlayer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Register a new player (NO EMAIL)
router.post("/register", async (req, res) => {
  try {
    const { name, ign, age, password } = req.body;

    // Check if IGN already exists
    const existingPlayer = await Player.findOne({ ign });
    if (existingPlayer) {
      return res.status(400).json({ message: "IGN already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new player
    const newPlayer = new Player({
      name,
      ign,
      age,
      password: hashedPassword,
    });

    await newPlayer.save();
    res.status(201).json({ message: "Player registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login player (by IGN, NOT email)
router.post("/login", async (req, res) => {
  try {
    console.log("Received Login Data:", req.body); // Log request data

    const { ign, password } = req.body;

    const player = await Player.findOne({ ign });
    if (!player) {
      return res.status(400).json({ message: "Invalid IGN or password" });
    }

    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid IGN or password" });
    }

    const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, playerId: player._id, ign: player.ign });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Guest Login
router.get("/guest", (req, res) => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const guestID = `Guest#${randomNum}`;

  res.status(200).json({ guestID });
});

export default router;
