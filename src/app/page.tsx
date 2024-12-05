import React from 'react'
import Link from 'next/link'
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();
  
  if (userId) {
    redirect("/dashboard");
  } else {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            CreativeAI Studio
          </h1>
          <p className="mb-8 text-xl text-gray-300">
            Create amazing content with the power of AI
          </p>
          <div className="space-x-4">
            <Link
              href="/sign-up"
              className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="px-6 py-3 text-lg font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const features = [
  {
    title: '🎨 AI Content Creation',
    description: 'Create videos, podcasts, blogs, images, and more with advanced AI tools.',
  },
  {
    title: '🚀 Creator Studio',
    description: 'Professional tools to edit, mix, and enhance your AI-generated content.',
  },
  {
    title: '🌐 Share & Monetize',
    description: 'Share your creations with the world and earn through our credit system.',
  },
  {
    title: '🤖 Smart Assistant',
    description: 'Get help from our AI chatbot to optimize your content creation process.',
  },
  {
    title: '👥 Community',
    description: 'Connect with other creators, collaborate, and share inspiration.',
  },
  {
    title: '📱 Multi-platform',
    description: 'Access your content and create from any device, anywhere.',
  },
]
