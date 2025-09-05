import { Request, Response, NextFunction } from "express";

// ✅ Admin Only Middleware
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
