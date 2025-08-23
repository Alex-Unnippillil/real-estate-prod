import express from "express";
import { createCompany } from "../controllers/companyControllers";

const router = express.Router();

router.post("/", createCompany);

export default router;
