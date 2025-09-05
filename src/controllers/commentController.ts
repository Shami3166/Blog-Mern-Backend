import {  Response } from "express";
import Comment from "../models/Comment";
import { AuthRequest } from "../middlewares/authMiddleware";
// ✅ Add comment (only logged-in users)
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const comment = new Comment({
      text,
      author: req.user._id,
      post: req.params.postId, // post id from URL
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all comments for a post
export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
