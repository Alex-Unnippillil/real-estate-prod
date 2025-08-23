import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createApplication,
  listApplications,
  updateApplicationStatus,
  createApplicationCheckoutSession,
  handleApplicationPaymentSuccess,
  handleApplicationPaymentCancel,
} from "../controllers/applicationControllers";

const router = express.Router();

router.post("/", authMiddleware(["tenant"]), createApplication);
router.put("/:id/status", authMiddleware(["manager"]), updateApplicationStatus);
router.get("/", authMiddleware(["manager", "tenant"]), listApplications);
router.post(
  "/:id/checkout-session",
  authMiddleware(["tenant"]),
  createApplicationCheckoutSession
);
router.get("/payment/success", handleApplicationPaymentSuccess);
router.get("/payment/cancel", handleApplicationPaymentCancel);

export default router;
