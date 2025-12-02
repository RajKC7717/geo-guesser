import express from "express";
import MultiplayerRoom from "../models/MultiplayerRoom.js";
import Player from "../models/Player.js";

const router = express.Router();

// 📌 Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await MultiplayerRoom.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Create a new room
router.post("/", async (req, res) => {
  try {
    const { ign } = req.body;

    // Ensure the host exists
    const host = await Player.findOne({ ign: ign });
    console.log(ign)
    if (!host) {
      return res.status(404).json({ message: "Host player not found" });
    }

    // Create new room
    const newRoom = new MultiplayerRoom({
      roomID: `ROOM_${Date.now()}`, // Generate a unique ID
      hostIGN: ign,
      players: [ign], // Host is automatically added
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Join a room
router.post("/join", async (req, res) => {
  try {
    const { roomID, ign } = req.body;

    console.log("Received roomID:", roomID);
    console.log("Received ign:", ign);

    if (!roomID || !ign) {
      return res.status(400).json({ message: "roomID and ign are required" });
    }

    const room = await MultiplayerRoom.findOne({ roomID });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    console.log("Current players in room:", room.players);

    if (room.players.includes(ign)) {
      return res.status(400).json({ message: "Player already in the room" });
    }

    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ message: "Room is full" });
    }

    room.players.push(ign);
    await room.save();

    res.status(200).json({
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// 📌 Get room details
router.get("/:roomID", async (req, res) => {
  try {
    const { roomID } = req.params;

    const room = await MultiplayerRoom.findOne({ roomID }).populate("players", "ign");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Start game in a room
router.patch("/:roomID/start", async (req, res) => {
  try {
    const { roomID } = req.params;

    const room = await MultiplayerRoom.findOne({ roomID });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.status !== "waiting") {
      return res.status(400).json({ message: "Game already started or finished" });
    }

    room.status = "in-progress";
    await room.save();

    res.status(200).json({ message: "Game started", room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Delete a room (end game)
router.delete("/:roomID", async (req, res) => {
  try {
    const { roomID } = req.params;

    const deletedRoom = await MultiplayerRoom.findOneAndDelete({ roomID });
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;