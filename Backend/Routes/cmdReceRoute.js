import express from "express";
import { OllamaController } from "../Controller/commandProccessController.js";
import { OrbitModeController } from "../Controller/orbitModeController.js";
import { toggleMicController } from "../Controller/Mic_ToggleController.js";
import { receiveOrbitLog } from "../Controller/orbitLogController.js";
import { GroqMsgController } from "../Controller/GroqMsgController.js";

const router = express.Router();
router.post("/cmd", OllamaController);
router.post("/mode", OrbitModeController);
router.post("/mic", toggleMicController);
router.post("/log", receiveOrbitLog);
router.post("/message", GroqMsgController);

export default router;
