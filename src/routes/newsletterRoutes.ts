import { Router } from "express";
import { subscribeNewsletter, getSubscribers, unsubscribeNewsletter } from "../controllers/newsletterController";
import { protect } from "../middlewares/authMiddleware";
import { adminOnly } from "../middlewares/roleMiddleware";

const router = Router();

// ✅ Public routes
router.post("/subscribe", subscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);

// ✅ Admin-only route
router.get("/", protect, adminOnly, getSubscribers);

export default router;
