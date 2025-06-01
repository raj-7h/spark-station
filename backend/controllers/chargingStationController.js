// controllers/chargingStationController.js
import ChargingStation from "../models/chargingStation.js";

export const createStation = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated properly for creation" });
    }
    const station = new ChargingStation({
      ...req.body,
      createdBy: req.user.id,
    });
    await station.save();
    res.status(201).json(station);
  } catch (err) {
    console.error(
      `[ERROR] Create Station - User: ${req.user?.id}, Error: ${err.message}`,
      err.stack
    );
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    res
      .status(500)
      .json({ message: "Failed to create station. Please try again later." });
  }
};

export const getAllStations = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated properly for listing" });
    }
    const stations = await ChargingStation.find({ createdBy: req.user.id });
    res.json(stations);
  } catch (err) {
    console.error(
      `[ERROR] Get All Stations - User: ${req.user?.id}, Error: ${err.message}`,
      err.stack
    );
    res
      .status(500)
      .json({
        message: "Failed to retrieve stations. Please try again later.",
      });
  }
};

export const updateStation = async (req, res) => {
  try {
    const stationIdToUpdate = req.params.id;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated properly for update" });
    }

    const station = await ChargingStation.findOneAndUpdate(
      { _id: stationIdToUpdate, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!station) {
      return res
        .status(404)
        .json({ message: "Station not found or you are not authorized" });
    }

    res.json(station);
  } catch (err) {
    console.error(
      `[ERROR] Update Station - User: ${req.user?.id}, Station: ${req.params.id}, Error: ${err.message}`,
      err.stack
    );
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    res
      .status(500)
      .json({ message: "Failed to update station. Please try again later." });
  }
};

export const deleteStation = async (req, res) => {
  try {
    const stationIdToDelete = req.params.id;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated properly for deletion" });
    }

    const station = await ChargingStation.findOneAndDelete({
      _id: stationIdToDelete,
      createdBy: req.user.id,
    });

    if (!station) {
      return res
        .status(404)
        .json({
          message:
            "Station not found or you are not authorized to delete this station",
        });
    }

    res.json({ message: "Station deleted successfully" });
  } catch (err) {
    console.error(
      `[ERROR] Delete Station - User: ${req.user?.id}, Station: ${req.params.id}, Error: ${err.message}`,
      err.stack
    );
    res
      .status(500)
      .json({ message: "Failed to delete station. Please try again later." });
  }
};
