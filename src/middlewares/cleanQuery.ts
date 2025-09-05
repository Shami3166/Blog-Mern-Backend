import { Request, Response, NextFunction } from "express";

export const cleanQuery = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query) return next();

  const cleanedQuery: Record<string, string> = {};

  Object.keys(req.query).forEach((key) => {
    const value = req.query[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed !== "") {
        cleanedQuery[key] = trimmed;
      }
    }
  });

  // Replace req.query with new object
  (req as any).query = cleanedQuery;

  next();
};
