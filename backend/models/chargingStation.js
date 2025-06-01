import mongoose from "mongoose";
const chargingStationSchema = new mongoose.Schema({
  name: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
  },
  powerOutput: Number,
  connectorType: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const ChargingStation = mongoose.model(
  "ChargingStation",
  chargingStationSchema
);

export default ChargingStation;
