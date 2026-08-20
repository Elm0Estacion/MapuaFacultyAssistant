export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
}

export interface FacultyPillarInfo {
  id: string;
  title: string;
  shortDesc: string;
  prompt: string;
  iconName: string;
  badge: string;
  benefits: string[];
}

