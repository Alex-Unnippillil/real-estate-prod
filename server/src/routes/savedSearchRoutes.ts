import express from "express";
import {
  listSavedSearches,
  createSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
} from "../controllers/savedSearchControllers";

const router = express.Router();

router.get("/", listSavedSearches);
router.post("/", createSavedSearch);
router.put("/:id", updateSavedSearch);
router.delete("/:id", deleteSavedSearch);

export default router;
