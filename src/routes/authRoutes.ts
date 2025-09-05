// backend/routes/authRoutes.ts
import { Router } from "express";
// ✅ use correct filename
import { protect } from "../middlewares/authMiddleware";
import upload from "../middlewares/upload";
import { getMe, loginUser, registerUser, updateMe } from "../controllers/authControllers";

const router = Router();

// ✅ Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Profile
router.get("/me", protect, getMe);
router.put("/me", protect, upload.single("avatar"), updateMe); 
// ⬆️ Now updateMe can handle avatar files if passed directly

// ✅ Option 2: Separate avatar upload route
router.post(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // If using local uploads
    const url = `/uploads/${req.file.filename}`;

    // If using Cloudinary + multer-storage-cloudinary:
    // const url = (req.file as any).path;

    res.json({ url });
  }
);

export default router;
