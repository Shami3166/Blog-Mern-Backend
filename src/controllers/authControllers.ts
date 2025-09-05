import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { validateEmail, validatePassword } from "../utils/validators";
import { logger } from "../utils/logger";
import { AuthRequest } from "../middlewares/authMiddleware";

// 📌 Register new user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validate inputs
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be 6+ chars and contain letters & numbers" });
    }

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create user
    const user: IUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // ✅ Generate token
    const token = generateToken(String(user._id), user.role);

    logger(`New user registered: ${email}`);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger(`Register error: ${error}`, "error");
    next(error);
  }
};

// 📌 Login user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate token
    const token = generateToken(String(user._id), user.role);

    logger(`User logged in: ${email}`);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger(`Login error: ${error}`, "error");
    next(error);
  }
};

// 📌 Get logged-in user profile
// 📌 Get logged-in user profile


// ✅ Get logged-in user profile
// src/controllers/authController.ts

// ✅ Get logged-in user profile
export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar || null, // ✅ include avatar
    },
  });
};

// ✅ Update logged-in user profile
export const updateMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { name, email, password } = req.body; 
  let avatar = req.body.avatar; // ✅ fallback for frontend sending avatar URL directly

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Handle avatar upload if file provided (via multer/cloudinary)
    if (req.file && (req.file as any).path) {
      avatar = (req.file as any).path; // multer-storage-cloudinary sets .path to Cloudinary URL
    }

    // ✅ Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    console.error("UpdateMe Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

