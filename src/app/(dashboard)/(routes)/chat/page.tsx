import { Metadata } from "next";
import ChatClient from "./components/chat-client";

export const metadata: Metadata = {
  title: "Chat - CreativeAI Studio",
  description: "Chat with AI and other creators",
};

export default function ChatPage() {
  return (
    <div className="h-full">
      <ChatClient />
    </div>
  );
}
