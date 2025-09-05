// src/models/Post.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  featuredImage?: string;
  images?: string[];
  videos?: string[];
  category: string; // ✅ New field
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    featuredImage: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],

    // ✅ Add category with fixed values
    category: {
      type: String,
      enum: [
        "General Mobile Tips",
        "WhatsApp Guides",
        "Social Media App Guides",
        "Google & Android App Guides",
        "iPhone App & iOS Tips",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;
