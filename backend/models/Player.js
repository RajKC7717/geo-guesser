import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Added Name field
  ign: { type: String, required: true, unique: true }, // In-Game Name
  age: { type: Number, required: true },
  password: { type: String, required: true }, // Hashed password will be stored
});

export default mongoose.model("Player", playerSchema);
