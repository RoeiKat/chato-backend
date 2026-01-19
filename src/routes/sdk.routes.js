import { Router } from "express";
import authApiKey from "../middleware/authApiKey.js";
import { sendMessage, getConfig } from "../controllers/sdk.controller.js";

const router = Router();

router.get("/config", authApiKey, getConfig);
router.post("/message", authApiKey, sendMessage);

export default router;
