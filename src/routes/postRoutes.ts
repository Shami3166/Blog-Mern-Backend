import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "../controllers/postController";
import { adminOnly } from "../middlewares/roleMiddleware";
import multer from "multer";

const router = Router();

// Configure Multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { uploadMedia } from "../controllers/postController";

// ✅ Restrict creation to admin only
router.post("/", protect, adminOnly, upload.single('featuredImage'), createPost); 
router.get("/", getPosts); 
router.get("/:id", getPostById);

// ✅ Restrict updates to admin only
router.put("/:id", protect, adminOnly, upload.single("featuredImage"), updatePost);

// ✅ Delete route is already correctly restricted to admin only
router.delete("/:id", protect, adminOnly, deletePost);
// --- ADD THIS to src/routes/postRoutes.ts ---

// Media upload for editors (admin only)
router.post(
  "/upload-media",
  protect,
  adminOnly,
  upload.single("media"),
  uploadMedia
);

export default router;
