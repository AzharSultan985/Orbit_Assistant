import express from "express";
import { getSystemInfo } from "../Controller/systemInfo.js";

const router = express.Router();
router.get("/system-info", getSystemInfo);

export default router;
