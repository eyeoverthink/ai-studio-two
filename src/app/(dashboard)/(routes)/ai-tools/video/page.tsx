import { Metadata } from "next";
import VideoGenerator from "./components/video-generator";

export const metadata: Metadata = {
  title: "AI Video Generation - CreativeAI Studio",
  description: "Create amazing videos with AI",
};

export default function VideoPage() {
  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">AI Video Generation</h1>
      </div>
      <VideoGenerator />
    </div>
  );
}
