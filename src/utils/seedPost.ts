import Post from "../models/Post";
import User from "../models/User";

interface SeedPost {
  title: string;
  content: string;
  category:string
}

const initialPosts: SeedPost[] = [
  {
    title: "Welcome to My Blog",
    content: "This is the first post. Edit or delete it as you like!",
    category: "General Mobile Tips",
  },
  {
    title: "React + TypeScript Setup",
    content: "Learn how to set up a React project with TypeScript and Redux Toolkit.",
    category: "General Mobile Tips",
  },
  {
    title: "Full Stack Guide",
    content: "This is a sample post for your full stack blog application.",
    category: "General Mobile Tips",
  },
  {
    title: "Getting Started with Node.js",
    content: "Node.js is a powerful JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to build scalable network applications using JavaScript on the server side.",
    category: "General Mobile Tips",
  }

];

export const seedPosts = async () => {
  try {
    const count = await Post.countDocuments();
    if (count === 0) {
      console.log("No posts found, starting seeding process...");
      
      // Find any user to use as author (preferably admin)
      const authorUser = await User.findOne();
      
      if (!authorUser) {
        console.log("❌ No users found in database. Please create a user first.");
        console.log("You can register through the frontend or create a user manually.");
        return;
      }
      
      console.log(`✅ Using author: ${authorUser.name} (${authorUser.email})`);
      
      // Add the author's ObjectId to all posts
      const postsWithAuthor = initialPosts.map(post => ({
        ...post,
        author: authorUser._id
      }));
      
      await Post.insertMany(postsWithAuthor);
      console.log("✅ Seeded initial posts successfully!");
    } else {
      console.log("ℹ️ Posts already exist, skipping seeding.");
    }
  } catch (err) {
    console.error("❌ Error seeding posts:", err);
  }
};