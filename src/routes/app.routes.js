// routes/app.routes.js
import { Router } from "express";
import authJwt from "../middleware/authJwt.js";
import {
  createApp,
  listApps,
  deleteApp,
  updateAppSettings
} from "../controllers/app.controller.js";

const router = Router();

router.post("/", authJwt, createApp);
router.get("/", authJwt, listApps);
router.delete("/:apiKey", authJwt, deleteApp);
router.patch("/:apiKey/settings", authJwt, updateAppSettings);

export default router;
