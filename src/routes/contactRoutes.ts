import express from "express";
import {
  sendMessage,
  getMessages,
  getMessageById,
  deleteMessage,
} from "../controllers/contactController";
import { protect } from "../middlewares/authMiddleware";
import { adminOnly } from "../middlewares/roleMiddleware";


const router = express.Router();

// User can send a message
router.post("/", protect, sendMessage);

// Admin routes
router.get("/", protect, adminOnly, getMessages);
router.get("/:id", protect, adminOnly, getMessageById);
router.delete("/:id", protect, adminOnly, deleteMessage);

export default router;
