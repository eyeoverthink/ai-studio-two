"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { Mic, Wand2, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCredits } from "@/hooks/use-credits";
import { CreditDisplay } from "@/components/shared/credit-display";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const voiceCategories = ['alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx'];

const PODCAST_GENERATION_COST = 1;

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  voiceType: z.string().min(1, {
    message: "Voice type is required.",
  }),
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

export const PodcastGenerator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = useState("");
  const { credits, setCredits } = useCredits();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      voiceType: "",
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      if (credits < PODCAST_GENERATION_COST) {
        toast({
          variant: "destructive",
          description: "Insufficient credits. Please purchase more credits to continue.",
        });
        return;
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/podcast`, values);
      
      if (response.data.audioUrl) {
        setAudioUrl(response.data.audioUrl);
        setCredits(credits - PODCAST_GENERATION_COST);
        toast({
          description: "Your podcast has been generated!",
        });
      }

      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error?.response?.data || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-4 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-2">
          <div className="p-2 w-fit rounded-md bg-gray-900">
            <Mic className="w-6 h-6 text-purple-500" />
          </div>
          <CreditDisplay cost={PODCAST_GENERATION_COST} />
        </div>
        <Button 
          variant="premium" 
          onClick={() => router.push("/credits")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          Buy Credits
        </Button>
      </div>

      <Card className="p-4 border-0 bg-gray-900/50 text-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-gray-800 border-gray-700 text-white" 
                      placeholder="Enter your podcast title" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="bg-gray-800 border-gray-700 text-white" 
                      placeholder="Enter a brief description of your podcast" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Voice Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select a voice type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {voiceCategories.map((voice) => (
                        <SelectItem 
                          key={voice} 
                          value={voice}
                          className="text-white hover:bg-gray-700"
                        >
                          {voice.charAt(0).toUpperCase() + voice.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="bg-gray-800 border-gray-700 text-white" 
                      placeholder="Enter the text you want to convert to speech" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center gap-x-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-x-2">
                    <Mic className="h-4 w-4" />
                    Generate
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      {audioUrl && (
        <Card className="p-4 mt-4 bg-gray-900/50 border-0">
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Card>
      )}
    </div>
  );
};
