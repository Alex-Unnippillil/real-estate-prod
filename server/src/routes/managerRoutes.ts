import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
  createPayoutOnboardingLink,
} from "../controllers/managerControllers";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.get("/:cognitoId/properties", getManagerProperties);
router.post("/:cognitoId/payout/onboard", createPayoutOnboardingLink);
router.post("/", createManager);

export default router;
