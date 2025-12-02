import mongoose from "mongoose";

const multiplayerRoomSchema = new mongoose.Schema({
  roomID: { type: String, required: true, unique: true }, // Unique room identifier
  hostIGN: { type: String, required: true }, // Player's IGN who created the room
  players: [{ type: String }], // Players' IGNs in the room
  maxPlayers: { type: Number, required: false, default: 5 }, // Maximum number of players allowed
  status: { type: String, enum: ["waiting", "in-progress", "finished"], default: "waiting" }, // Room status
  createdAt: { type: Date, default: Date.now }, // Timestamp of room creation
});

export default mongoose.model("MultiplayerRoom", multiplayerRoomSchema);
