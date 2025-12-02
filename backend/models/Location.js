import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  locationID: { type: String, required: true, unique: true }, // Unique ID for each location
  gameID: { type: mongoose.Schema.Types.ObjectId, ref: "GameSession", required: true }, // Reference to game session
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  imageUrl: { type: String, required: true }, // Street view image URL
});

export default mongoose.model("Location", locationSchema);
