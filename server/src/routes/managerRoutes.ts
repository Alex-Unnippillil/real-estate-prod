import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
  requestManagerDataExport,
  requestManagerAccountDeletion,
} from "../controllers/managerControllers";

const router = express.Router();

router.get("/:cognitoId/export", requestManagerDataExport);
router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.get("/:cognitoId/properties", getManagerProperties);
router.post("/", createManager);
router.delete("/:cognitoId", requestManagerAccountDeletion);

export default router;
