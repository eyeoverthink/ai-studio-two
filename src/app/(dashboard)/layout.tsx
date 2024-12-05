import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
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

const navigation = [
  {
    name: "Creator Studio",
    href: "/studio",
    icon: Layout,
  },
  {
    name: "AI Video",
    href: "/ai-tools/video",
    icon: Video,
  },
  {
    name: "AI Podcast",
    href: "/ai-tools/podcast",
    icon: Mic,
  },
  {
    name: "AI Blog",
    href: "/ai-tools/blog",
    icon: PenTool,
  },
  {
    name: "AI Image",
    href: "/ai-tools/image",
    icon: ImageIcon,
  },
  {
    name: "AI Music",
    href: "/ai-tools/music",
    icon: Music,
  },
  {
    name: "AI Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "AI Audiobook",
    href: "/ai-tools/audiobook",
    icon: BookOpen,
  },
  {
    name: "Design Tools",
    href: "/ai-tools/design",
    icon: Palette,
  },
  {
    name: "Credits",
    href: "/credits",
    icon: CreditCard,
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-gray-800 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              CreativeAI Studio
            </h1>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex items-center w-full">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                  },
                }}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
