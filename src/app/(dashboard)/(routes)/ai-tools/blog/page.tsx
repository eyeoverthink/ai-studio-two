import { Metadata } from "next";
import BlogGenerator from "./components/blog-generator";

export const metadata: Metadata = {
  title: "AI Blog Generation - CreativeAI Studio",
  description: "Create engaging blog posts with AI",
};

export default function BlogPage() {
  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">AI Blog Generation</h1>
      </div>
      <BlogGenerator />
    </div>
  );
}
