import express, { Application, Request, Response } from "express";
import dotenvSafe from "dotenv-safe";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import morgan from "morgan";

// Imports
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import contactRoutes from "./routes/contactRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import newsletterRoutes from "./routes/newsletterRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import { seedAdmin } from "./utils/seedAdmin";
import { seedPosts } from "./utils/seedPost";

// ✅ Load environment variables safely
if (process.env.NODE_ENV !== "production") {
  dotenvSafe.config({
    allowEmptyValues: false, // enforce values locally
    example: ".env.example",
  });
}

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Connect to MongoDB and seed data
connectDB().then(() => {
  seedPosts();
  seedAdmin(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
});

const app: Application = express();

// ✅ Core Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://techguides.vercel.app", // ✅ Updated with your new Vercel domain
    ],
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
  })
);
app.use(xss());

// ✅ Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Test route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running successfully...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);

// ✅ 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down gracefully...");
  server.close(() => process.exit(0));
});

export { cloudinary };
