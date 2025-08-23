import express from "express";
import { scheduleTour, cancelTour, rescheduleTour } from "../controllers/tourControllers";

const router = express.Router();

router.post("/", scheduleTour);
router.put("/:id/cancel", cancelTour);
router.put("/:id/reschedule", rescheduleTour);

export default router;
