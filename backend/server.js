// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import playerRoutes from "./routes/playerRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import roomRoutes from "./routes/multiplayerRoomRoutes.js";
import gameSessionRoutes from "./routes/gameSessionRoutes.js";
import dataSetRouter from "./routes/dataRoutes.js";
import socketIO from "./socketHandler.js"; // 👈 NEW IMPORT

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Use the refactored socket logic
socketIO(io); // 👈 CALL THE SOCKET HANDLER HERE

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API routes
app.use("/api/players", playerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/gamesessions", gameSessionRoutes);
app.use("/api/dataSet", dataSetRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
