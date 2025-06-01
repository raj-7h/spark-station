import express from "express";
import auth from "../middleware/auth.js";

import {
  createStation,
  getAllStations,
  updateStation,
  deleteStation,
} from "../controllers/chargingStationController.js";

const router = express.Router();

router.post("/", auth, createStation);
router.get("/", auth, getAllStations);
router.put("/:id", auth, updateStation);
router.delete("/:id", auth, deleteStation);

export default router;
