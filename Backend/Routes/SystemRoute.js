import express from "express";
import { getSystemInfo } from "../Controller/systemInfo.js";
import FetchConversation from "../Controller/FetchConversation.js";

const router = express.Router();
router.get("/system-info", getSystemInfo);
router.get("/conversation", FetchConversation);

export default router;
