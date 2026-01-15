import { Router } from "express";
import authJwt from "../middleware/authJwt.js";
import { createApp } from "../controllers/app.controller.js";

const router = Router();

router.post("/", authJwt, createApp);

export default router;
