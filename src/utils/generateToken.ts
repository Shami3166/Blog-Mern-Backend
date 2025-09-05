// src/utils/generateToken.ts
import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  return jwt.sign(
    { id, role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};