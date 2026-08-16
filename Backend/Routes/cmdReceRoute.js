import express from "express";
import { OrbitModeController } from "../Controller/orbitModeController.js";
import { toggleMicController } from "../Controller/Mic_ToggleController.js";
import { receiveOrbitLog } from "../Controller/orbitLogController.js";


const router = express.Router();
router.post("/mode", OrbitModeController);
router.post("/mic", toggleMicController);
router.post("/log", receiveOrbitLog);

export default router;
