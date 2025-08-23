import express from "express";
import { authMiddleware } from "@server/middleware/authMiddleware";
import { getLeasePayments, getLeases } from "@server/controllers/leaseControllers";

const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getLeases);
router.get(
  "/:id/payments",
  authMiddleware(["manager", "tenant"]),
  getLeasePayments
);

export default router;
