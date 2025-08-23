import express from "express";
import { getConversations, getMessages, sendMessage } from "../controllers/messageControllers";

const router = express.Router();

router.get("/:userId/conversations", getConversations);
router.get("/:userId/:otherUserId", getMessages);
router.post("/", sendMessage);

export default router;
