import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { listInvoices, payInvoice } from "../controllers/invoiceControllers";

const router = express.Router();

router.get("/", authMiddleware(["tenant"]), listInvoices);
router.post("/:id/pay", authMiddleware(["tenant"]), payInvoice);

export default router;
