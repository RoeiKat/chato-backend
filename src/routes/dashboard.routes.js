// routes/dashboard.routes.js
import { Router } from "express";
import authJwt from "../middleware/authJwt.js";
import { reply, markSessionRead } from "../controllers/dashboard.controller.js";

const router = Router();

router.post("/message", authJwt, reply);
router.post("/session/read", authJwt, markSessionRead);

export default router;
