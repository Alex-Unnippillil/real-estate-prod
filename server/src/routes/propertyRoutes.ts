import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
} from "@server/controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "@server/middleware/authMiddleware";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  createProperty
);

export default router;
