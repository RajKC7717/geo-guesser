// routes/dataRoutes.js
import express from 'express';
import DataSet from '../models/DataSet.js';

const router = express.Router();

// POST route to add new location
router.post('/', async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Check if lat/lng combo already exists
    const existing = await DataSet.findOne({ lat, lng });
    if (existing) {
      return res.status(200).json({ message: 'Duplicate location skipped' });
    }

    // Get latest index
    const lastEntry = await DataSet.findOne().sort({ index: -1 });
    const newIndex = lastEntry ? lastEntry.index + 1 : 1;

    const location = new DataSet({ index: newIndex, lat, lng });
    await location.save();

    res.status(201).json({ message: 'Location saved successfully', index: newIndex });
  } catch (err) {
    console.error('Error saving location:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET route to fetch all saved locations
router.get('/', async (req, res) => {
  try {
    const data = await DataSet.find().sort({ index: 1 }); // Optional: sort by index
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

export default router;
