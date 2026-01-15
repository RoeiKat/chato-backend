import { Router } from "express";
import authJwt from "../middleware/authJwt.js";
import { reply } from "../controllers/dashboard.controller.js";

const router = Router();

router.post("/message", authJwt, reply);

export default router;
