import { Request, Response } from "express";
import Newsletter from "../models/Newsletter";
import { validateEmail } from "../utils/validators";
import nodemailer from "nodemailer";

// ✅ Setup mail transporter (can also move to /utils/email.ts)
const transporter = nodemailer.createTransport({
  service: "gmail", // or Outlook, Yahoo, custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password
  },
});

// ✅ Subscribe to newsletter
export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const subscription = new Newsletter({ email });
    await subscription.save();

    // ✅ Send confirmation email
    await transporter.sendMail({
      from: `"Mobile & App Guides" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Subscription Confirmed - Mobile & App Guides",
      html: `
        <h2>Welcome to Mobile & App Guides!</h2>
        <p>Thank you for subscribing to our newsletter 🙌.</p>
        <p>You’ll now get the latest <b>mobile & app guides</b> delivered straight to your inbox 🚀.</p>
        <br/>
        <p>If you ever wish to unsubscribe, you can do so anytime from your profile.</p>
        <br/>
        <p>Best regards,</p>
        <p><b>The Mobile & App Guides Team</b></p>
      `,
    });

    res.status(201).json({
      message: "Subscribed successfully and confirmation email sent!",
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all subscribers (admin only)
export const getSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Unsubscribe from newsletter
export const unsubscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const removed = await Newsletter.findOneAndDelete({ email });

    if (!removed) {
      return res.status(404).json({ message: "Email not found in subscribers" });
    }

    res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
