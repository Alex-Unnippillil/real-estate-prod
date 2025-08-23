import express from "express";
import { sendSms } from "../controllers/smsController";

const router = express.Router();

router.post("/", sendSms);

export default router;
