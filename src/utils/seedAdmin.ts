// src/utils/seedAdmin.ts
import bcrypt from "bcryptjs";
import User from "../models/User";

export const seedAdmin = async (email?: string, password?: string) => {
  if (!email || !password) return;
  const exists = await User.findOne({ email });
  if (exists) return;

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name: "Admin", email, password: hashed, role: "admin" });
  console.log("✅ Admin user seeded:", email);
};
