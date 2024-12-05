import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { 
  Layout, 
  Video, 
  Mic, 
  PenTool, 
  Image as ImageIcon,
  Music,
  MessageSquare,
  BookOpen,
  Palette,
  CreditCard
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard - CreativeAI Studio",
  description: "Your AI-powered content creation dashboard",
};

const tools = [
  {
    name: "Creator Studio",
    description: "Your creative workspace for all content types",
    href: "/studio",
    icon: Layout,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "AI Video",
    description: "Create and edit videos with AI assistance",
    href: "/ai-tools/video",
    icon: Video,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "AI Podcast",
    description: "Generate and edit podcast content",
    href: "/ai-tools/podcast",
    icon: Mic,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "AI Blog",
    description: "Write engaging blog posts with AI",
    href: "/ai-tools/blog",
    icon: PenTool,
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "AI Image",
    description: "Generate and edit images with AI",
    href: "/ai-tools/image",
    icon: ImageIcon,
    color: "from-red-500 to-pink-500",
  },
  {
    name: "AI Music",
    description: "Create music and audio with AI",
    href: "/ai-tools/music",
    icon: Music,
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "AI Chat",
    description: "Chat with AI for creative inspiration",
    href: "/chat",
    icon: MessageSquare,
    color: "from-teal-500 to-green-500",
  },
  {
    name: "AI Audiobook",
    description: "Convert text to natural-sounding audiobooks",
    href: "/ai-tools/audiobook",
    icon: BookOpen,
    color: "from-orange-500 to-red-500",
  },
];

export default async function DashboardPage() {
  const { userId } = auth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to CreativeAI Studio</h1>
        <p className="text-gray-400">Choose a tool to start creating amazing content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${tool.color} mb-4`}>
              <tool.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
            <p className="text-gray-400 text-sm">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
