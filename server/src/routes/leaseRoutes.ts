import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getLeaseInvoices, getLeases } from "../controllers/leaseControllers";

const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getLeases);
router.get(
  "/:id/invoices",
  authMiddleware(["manager", "tenant"]),
  getLeaseInvoices
);

export default router;
