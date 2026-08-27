import express from "express";
import { getSystemInfo } from "../Controller/systemInfo.js";
import {FetchConversation} from "../Controller/FetchConversation.js";
import { SaveTaskController } from "../Controller/SaveTasks.js";
import { FetchTasks } from "../Controller/fetchTasks.js";

const router = express.Router();
router.get("/system-info", getSystemInfo);
router.get("/conversation", FetchConversation);
router.get("/fetch-tasks", FetchTasks);
router.post("/task-save", SaveTaskController);

export default router;
