"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import { CreditDisplay } from "@/components/shared/credit-display";
import { Wand2, Type, Layout, Image as ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";

const BLOG_GENERATION_COST = 5;

const TiptapExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  TiptapLink.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-500 hover:text-blue-600 underline',
    },
  }),
  TiptapImage.configure({
    HTMLAttributes: {
      class: 'rounded-lg max-w-full h-auto',
    },
  }),
];

export default function BlogGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [generating, setGenerating] = useState(false);

  const editor = useEditor({
    extensions: TiptapExtensions,
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-2",
      },
    },
  });

  const handleGenerate = async () => {
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      setGenerating(true);
      
      const response = await fetch("/api/ai/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          tone,
          length,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate blog content");
      }

      const data = await response.json();
      editor?.commands.setContent(data.content);
      toast.success("Blog content generated successfully!");
    } catch (error) {
      console.error("Error generating blog:", error);
      toast.error("Failed to generate blog content");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const content = editor?.getHTML();
      if (!content) {
        toast.error("No content to save");
        return;
      }

      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "blog",
          title: topic,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save blog content");
      }

      toast.success("Blog content saved successfully!");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog content");
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor?.chain().focus().insertContent({
        type: 'image',
        attrs: { src: url }
      }).run();
    }
  };

  const toolbarItems = [
    {
      icon: Type,
      title: "Toggle Heading",
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor?.isActive("heading", { level: 2 }) ?? false,
    },
    {
      icon: Layout,
      title: "Add Link",
      action: () => {
        const url = window.prompt("Enter URL");
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: () => editor?.isActive("link") ?? false,
    },
    {
      icon: ImageIcon,
      title: "Add Image",
      action: addImage,
      isActive: () => editor?.isActive("image") ?? false,
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <CreditDisplay cost={BLOG_GENERATION_COST} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your blog topic..."
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
            <option value="technical">Technical</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Length</label>
        <div className="flex gap-4">
          {["short", "medium", "long"].map((option) => (
            <button
              key={option}
              onClick={() => setLength(option)}
              className={`rounded-lg px-4 py-2 ${
                length === option
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-600 bg-gray-800">
        <div className="flex items-center gap-2 border-b border-gray-600 px-4 py-2">
          {toolbarItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`p-2 rounded hover:bg-gray-700 transition ${
                item.isActive() ? "bg-gray-700" : ""
              }`}
              title={item.title}
            >
              <item.icon className="h-5 w-5" />
            </button>
          ))}
        </div>
        {editor && <EditorContent editor={editor} />}
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleGenerate}
          disabled={generating || !topic}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Wand2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              Generate
            </>
          )}
        </button>
        <button
          onClick={handleSave}
          disabled={!editor?.getText()}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          Save
        </button>
      </div>
    </div>
  );
}
