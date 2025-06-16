export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
  lastSeen?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  readBy: string[];
}

export interface Chat {
  id: string;
  type: "direct" | "group";
  name?: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  user: User;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
} 