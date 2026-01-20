import { Router } from "express";
import authJwt from "../middleware/authJwt.js";
import {
  reply,
  markSessionRead,

  // NEW
  createShift,
  listShifts,
  listReminders,
  createReminder,
  deleteReminder,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.post("/message", authJwt, reply);
router.post("/session/read", authJwt, markSessionRead);

router.post("/shifts", authJwt, createShift);
router.get("/shifts", authJwt, listShifts);

router.get("/reminders", authJwt, listReminders);
router.post("/reminders", authJwt, createReminder);
router.delete("/reminders/:id", authJwt, deleteReminder);

export default router;
