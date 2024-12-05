import { Metadata } from "next";
import {
  ArrowUpRight,
  Video,
  Mic,
  PenTool,
  Image as ImageIcon,
  Music,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Creator Studio - CreativeAI Studio",
  description: "Create and manage your AI-generated content",
};

const tools = [
  {
    label: "AI Video Creation",
    icon: Video,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/ai-tools/video",
  },
  {
    label: "AI Podcast Creation",
    icon: Mic,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/ai-tools/podcast",
  },
  {
    label: "AI Blog Writing",
    icon: PenTool,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/ai-tools/blog",
  },
  {
    label: "AI Image Generation",
    icon: ImageIcon,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/ai-tools/image",
  },
  {
    label: "AI Music Creation",
    icon: Music,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/ai-tools/music",
  },
  {
    label: "AI Chat Assistant",
    icon: MessageSquare,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    href: "/chat",
  },
];

export default function CreatorStudioPage() {
  return (
    <div className="h-full p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.href}
            className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-6 h-6", tool.color)} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {tool.label}
              </h3>
              <p className="text-sm text-gray-400">
                Create amazing {tool.label.toLowerCase()} with AI
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Projects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* We'll add recent projects here */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No projects yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
