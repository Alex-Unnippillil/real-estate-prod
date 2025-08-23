import express from "express";
import { handleStripeWebhook } from "../controllers/stripeController";

const router = express.Router();

// Stripe needs raw body to validate signature
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
