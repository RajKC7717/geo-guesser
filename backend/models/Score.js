import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  playerID: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  gameID: { type: String, required: true }, // Unique ID for each game session
  rounds: { type: Array, required: true }, // Stores scores for each round
  totalScore: { type: Number, required: true },
  accurateGuessTime: { type: Number, default: null }, // Time taken for best accurate guess
});

export default mongoose.model("Score", scoreSchema);
