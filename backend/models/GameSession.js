import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
  gameID: { type: String, required: true, unique: true }, // Unique identifier for the game session
  mode: { type: String, enum: ["Singleplayer", "Multiplayer"], required: true }, // Game mode
  players: [
    {
      ign: { type: String, required: true },
      score: { type: Number, default: 0 }
    }
  ], // Players as objects instead of ObjectId
  totalRounds: { type: Number, required: true }, // Number of rounds in the game
  timePerRound: { type: mongoose.Schema.Types.Mixed, required: true }, // Accepts Number or "No Time Limit"
  currentRound: { type: Number, default: 1 }, // Tracks current round number
  status: { type: String, enum: ["Active", "Completed"], default: "Active" }, // Game status
  createdAt: { type: Date, default: Date.now }, // Timestamp for session start
});

export default mongoose.model("GameSession", gameSessionSchema);
