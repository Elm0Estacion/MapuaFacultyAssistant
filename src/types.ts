export type UserRole = "student" | "faculty";
export type AIProvider = "gemini" | "ollama";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentIdOrFacultyId: string;
  avatarText: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
  provider?: string; // "gemini" | "ollama" | specific model
}

export interface Conversation {
  id: string;
  userEmail: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  role: UserRole;
  selectedProvider?: AIProvider;
}

export interface PillarInfo {
  id: string;
  title: string;
  shortDesc: string;
  prompt: string;
  iconName: string;
  badge: string;
  benefits: string[];
}

export interface AIStatusResponse {
  provider: AIProvider;
  geminiKeySet: boolean;
  ollamaReachable: boolean;
  ollamaHost: string;
  ollamaModel: string;
  installedModels: string[];
  details: string;
}
