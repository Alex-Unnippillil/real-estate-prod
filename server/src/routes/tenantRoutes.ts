import express from "express";
import {
  getTenant,
  createTenant,
  updateTenant,
  getCurrentResidences,
  addFavoriteProperty,
  removeFavoriteProperty,
  requestTenantDataExport,
  requestTenantAccountDeletion,
} from "../controllers/tenantControllers";

const router = express.Router();

router.get("/:cognitoId/export", requestTenantDataExport);
router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.post("/", createTenant);
router.get("/:cognitoId/current-residences", getCurrentResidences);
router.post("/:cognitoId/favorites/:propertyId", addFavoriteProperty);
router.delete("/:cognitoId/favorites/:propertyId", removeFavoriteProperty);
router.delete("/:cognitoId", requestTenantAccountDeletion);

export default router;
