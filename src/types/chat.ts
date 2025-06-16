export interface User {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  status: 'online' | 'away' | 'offline';
}

export interface ChatParticipant {
  userId: User;
  role: 'admin' | 'member';
  joinedAt: Date;
  lastRead: Date;
}

export interface ChatMessage {
  _id: string;
  chatId: string;
  sender: User;
  content: string;
  contentType: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    fileUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
    width?: number;
    height?: number;
    location?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  replyTo?: ChatMessage;
  reactions: Array<{
    userId: string;
    emoji: string;
    timestamp: Date;
  }>;
  readBy: Array<{
    userId: string;
    timestamp: Date;
  }>;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  _id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  picture?: string;
  participants: ChatParticipant[];
  lastMessage?: {
    messageId: string;
    content: string;
    sender: User;
    timestamp: Date;
    contentType: string;
  };
  isEncrypted: boolean;
  settings?: {
    slowMode?: number;
    isPublic?: boolean;
    joinLink?: string;
  };
  createdAt: Date;
  updatedAt: Date;
} 