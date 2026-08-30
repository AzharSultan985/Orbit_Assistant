import express from "express";
import { OrbitModeController } from "../Controller/orbitModeController.js";
import { toggleMicController } from "../Controller/Mic_ToggleController.js";
import { receiveOrbitLog } from "../Controller/orbitLogController.js";
import { Save_OrbitVoice_Msg } from "../Controller/OrbitvoiceMSG.js";
import { SaveReminder } from "../Controller/SaveReminder.js";


const router = express.Router();
router.post("/mode", OrbitModeController);
router.post("/mic", toggleMicController);
router.post("/log", receiveOrbitLog);
router.post("/message-save", Save_OrbitVoice_Msg);
router.post("/save-reminder", SaveReminder);

export default router;
