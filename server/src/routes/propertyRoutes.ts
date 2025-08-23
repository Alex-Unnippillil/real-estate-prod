import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  generateUploadUrl,
} from "../controllers/propertyControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getProperties);
router.get("/upload-url", authMiddleware(["manager"]), generateUploadUrl);
router.get("/:id", getProperty);
router.post("/", authMiddleware(["manager"]), createProperty);

export default router;
