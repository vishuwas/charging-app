const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const ChargingStation = require("../models/ChargingStation");

// Create a new charging station
router.post("/", verifyToken, async (req, res) => {
  try {
    const station = new ChargingStation(req.body);
    await station.save();
    res.status(201).json(station);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create station", error: err.message });
  }
});

// Get all charging stations
router.get("/", async (req, res) => {
  try {
    const stations = await ChargingStation.find();
    res.json(stations);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch stations", error: err.message });
  }
});

// Get a specific station by ID
router.get("/:id", async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching station", error: err.message });
  }
});

// Update a charging station
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await ChargingStation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Station not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update", error: err.message });
  }
});

// Delete a charging station
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await ChargingStation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Station not found" });
    res.json({ message: "Station deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
});

module.exports = router;
