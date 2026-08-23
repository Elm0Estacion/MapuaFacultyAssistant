export type UserRole = "student" | "faculty";

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
