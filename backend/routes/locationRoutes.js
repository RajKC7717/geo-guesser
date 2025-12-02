import express from "express";
import Location from "../models/Location.js";

const router = express.Router();

// 📌 Add a new location
router.post("/", async (req, res) => {
  try {
    const { locationID, gameID, latitude, longitude, imageUrl } = req.body;

    const newLocation = new Location({
      locationID,
      gameID,
      latitude,
      longitude,
      imageUrl,
    });

    await newLocation.save();
    res.status(201).json({ message: "Location added successfully", newLocation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Get all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Get a specific location by ID
router.get("/:locationID", async (req, res) => {
  try {
    const { locationID } = req.params;
    const location = await Location.findOne({ locationID });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 Delete a location (optional)
router.delete("/:locationID", async (req, res) => {
  try {
    const { locationID } = req.params;
    const deletedLocation = await Location.findOneAndDelete({ locationID });

    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
