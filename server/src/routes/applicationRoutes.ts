import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createApplication,
  listApplications,
  updateApplicationStatus,
  saveApplicationDraft,
  getApplicationDraft,
  generatePresignedUrl,
} from "../controllers/applicationControllers";

const router = express.Router();

router.post("/", authMiddleware(["tenant"]), createApplication);
router.put("/:id/status", authMiddleware(["manager"]), updateApplicationStatus);
router.get("/", authMiddleware(["manager", "tenant"]), listApplications);
router.post(
  "/draft",
  authMiddleware(["tenant"]),
  saveApplicationDraft
);
router.get(
  "/draft",
  authMiddleware(["tenant"]),
  getApplicationDraft
);
router.post(
  "/presigned-url",
  authMiddleware(["tenant"]),
  generatePresignedUrl
);

export default router;
