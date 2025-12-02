// models/DataSet.js
import mongoose from "mongoose";

const DataSetSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
    unique: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true, // Make this true so all new entries must have it
  },
  state: {
    type: String,
    required: true, // Make this true so all new entries must have it
  },

}, { timestamps: true });

DataSetSchema.index({ lat: 1, lng: 1 }, { unique: true }); // ensure unique lat/lng

const DataSet = mongoose.model('DataSet', DataSetSchema);
export default DataSet;
