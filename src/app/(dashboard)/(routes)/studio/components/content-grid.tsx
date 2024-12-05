"use client";

import { useState, useEffect } from "react";
import { 
  Video, 
  Mic, 
  PenTool, 
  Image as ImageIcon,
  Music,
  Share2,
  Download,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Content {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  thumbnail: string;
  createdAt: string;
  tags: string[];
}

const typeIcons = {
  VIDEO: Video,
  PODCAST: Mic,
  BLOG: PenTool,
  IMAGE: ImageIcon,
  MUSIC: Music,
};

export default function ContentGrid() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error("Failed to fetch contents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      await fetch(`/api/content/${id}`, { method: "DELETE" });
      setContents(contents.filter((content) => content.id !== id));
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const handleShare = async (content: Content) => {
    try {
      await navigator.share({
        title: content.title,
        text: content.description,
        url: content.url,
      });
    } catch (error) {
      console.error("Failed to share content:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No content yet. Start creating!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contents.map((content) => {
        const Icon = typeIcons[content.type as keyof typeof typeIcons];

        return (
          <div
            key={content.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition"
          >
            <div className="aspect-video relative bg-gray-900">
              {content.thumbnail ? (
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {content.title}
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleShare(content)}
                  className="p-2 text-gray-400 hover:text-white transition"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <a
                  href={content.url}
                  download
                  className="p-2 text-gray-400 hover:text-white transition"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(content.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
