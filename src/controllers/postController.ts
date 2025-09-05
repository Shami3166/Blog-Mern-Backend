import { Response } from "express";
import Post from "../models/Post";
import { cloudinary } from "../server";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category } = req.body; // ✅ include category
    const featuredImage = req.file;

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    let imageUrl: string | undefined;
    if (featuredImage) {
      const b64 = Buffer.from(featuredImage.buffer).toString("base64");
      const dataURI = "data:" + featuredImage.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });
      imageUrl = result.secure_url;
    }

    const post = new Post({
      title,
      content,
      author: req.user._id,
      featuredImage: imageUrl,
      category, // ✅ save category
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



// ✅ Get all posts
// ✅ Get all posts (with optional category & search filter)
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search } = req.query;

    let filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive
    }

    const posts = await Post.find(filter).populate("author", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Get single post
export const getPostById = async (req: AuthRequest, res: Response) => {
 try {
  const post = await Post.findById(req.params.id).populate("author", "name email");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
 } catch (error) {
  res.status(500).json({ message: "Server error", error });
 }
};

// ✅ Update post (only author)
// ✅ Update post (only author/admin)
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.findById(req.params.id);
    const featuredImage = req.file;

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;

    if (featuredImage) {
      const b64 = Buffer.from(featuredImage.buffer).toString("base64");
      const dataURI = `data:${featuredImage.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, { resource_type: "auto" });
      post.featuredImage = result.secure_url;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Delete post (only admin)
export const deletePost = async (req: AuthRequest, res: Response) => {
 try {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.user?.role !== "admin") {
   return res.status(403).json({ message: "Only admin can delete posts" });
  }

  await post.deleteOne();
  res.json({ message: "Post deleted" });
 } catch (error) {
  res.status(500).json({ message: "Server error", error });
 }
};




export const uploadMedia = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file provided" });

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "blog-posts",
    });

    return res.status(201).json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload media error:", error);
    return res.status(500).json({ message: "Failed to upload media", error });
  }
};
