import { Request, Response, NextFunction } from "express";

// Custom error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err.message);

  // If you want detailed stack only in dev
  const isDev = process.env.NODE_ENV !== "production";

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    ...(isDev && { stack: err.stack }), // only show stack in dev
  });
};
