import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  uploadProperties,
} from "../controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";

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

router.post(
  "/upload",
  authMiddleware(["manager"]),
  upload.single("file"),
  uploadProperties
);

export default router;
