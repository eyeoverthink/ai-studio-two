export interface PodcastFormValues {
  title: string;
  description: string;
  voiceType: string;
  prompt: string;
}

export interface User {
  id: string;
  credits: number;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}
