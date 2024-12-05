import { Metadata } from "next";

import { PodcastGenerator } from "./components/podcast-generator";

export const metadata: Metadata = {
  title: "AI Podcast Generator - CreativeAI Studio",
  description: "Create engaging podcasts with AI assistance",
};

const PodcastPage = () => {
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center">
          AI Podcast Generator
        </h2>
        <p className="text-white font-light text-sm md:text-lg text-center">
          Transform your ideas into engaging podcast episodes
        </p>
      </div>
      <div className="px-4 lg:px-8">
        <PodcastGenerator />
      </div>
    </div>
  );
};

export default PodcastPage;
