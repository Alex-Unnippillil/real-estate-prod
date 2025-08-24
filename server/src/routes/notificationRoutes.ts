import express from "express";
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationsRead,
} from "../controllers/notificationControllers";

const router = express.Router();

router.get("/:cognitoId", getNotifications);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);
router.put("/:cognitoId/mark-read", markNotificationsRead);

export default router;
