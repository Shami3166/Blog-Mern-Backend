import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { addComment, getComments } from "../controllers/commentController";
// fixed folder name

const router = Router({ mergeParams: true });

// ✅ Routes
router.post("/", protect, addComment);  
router.get("/", getComments);           

export default router;
