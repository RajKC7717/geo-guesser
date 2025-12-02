import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  playerID: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  ign: { type: String, required: true }, 
  matchesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  bestAccurateGuessTime: { type: Number, default: Infinity }, // in seconds
});

export default mongoose.model("Leaderboard", leaderboardSchema);
