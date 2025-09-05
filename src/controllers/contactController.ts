import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Contact } from "../models/Contact";


// @desc Send a contact message
// @route POST /api/contacts
// @access Private (logged-in users)
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const newMessage = await Contact.create({
    user: req.user._id,
    name,
    email,
    message,
  });

  res.status(201).json(newMessage);
});

// @desc Get all messages (Admin only)
// @route GET /api/contacts
// @access Private/Admin
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const messages = await Contact.find().populate("user", "username email");
  res.status(200).json(messages);
});

// @desc Get single message
// @route GET /api/contacts/:id
// @access Private/Admin
export const getMessageById = asyncHandler(async (req: Request, res: Response) => {
  const message = await Contact.findById(req.params.id).populate("user", "username email");

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  res.status(200).json(message);
});

// @desc Delete message
// @route DELETE /api/contacts/:id
// @access Private/Admin
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await Contact.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  await message.deleteOne();

  res.status(200).json({ message: "Message deleted successfully" });
});
