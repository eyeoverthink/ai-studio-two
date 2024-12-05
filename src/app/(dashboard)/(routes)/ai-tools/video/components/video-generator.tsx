"use client";

import { useState } from "react";
import { CreditDisplay } from "@/components/shared/credit-display";
import { VideoIcon, Wand2 } from "lucide-react";

const VIDEO_GENERATION_COST = 10;

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("15");
  const [style, setStyle] = useState("realistic");
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, duration, style }),
      });

      if (!response.ok) throw new Error("Failed to generate video");

      const data = await response.json();
      setVideoUrl(data.url);
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CreditDisplay cost={VIDEO_GENERATION_COST} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video (e.g., A cinematic scene of a sunset over a mountain range)"
            className="w-full h-32 bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Duration (seconds)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="realistic">Realistic</option>
              <option value="animated">Animated</option>
              <option value="artistic">Artistic</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={generating || !prompt}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {generating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Generating Video...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Wand2 className="w-5 h-5" />
              Generate Video
            </div>
          )}
        </button>
      </form>

      {videoUrl && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-white">Generated Video</h2>
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              controls
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="flex justify-end">
            <a
              href={videoUrl}
              download
              className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition"
            >
              <VideoIcon className="w-4 h-4" />
              Download Video
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
