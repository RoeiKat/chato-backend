import { Router } from "express";
import authApiKey from "../middleware/authApiKey.js";
import { sendMessage } from "../controllers/sdk.controller.js";

const router = Router();

router.post("/message", authApiKey, sendMessage);

export default router;
