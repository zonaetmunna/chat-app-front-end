import { useAuth } from '@/contexts/AuthContext';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface Message {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
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
  replyTo?: Message;
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

interface Chat {
  _id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  picture?: string;
  participants: Array<{
    userId: {
      _id: string;
      username: string;
      fullName: string;
      profilePicture?: string;
      status: 'online' | 'away' | 'offline';
    };
    role: 'admin' | 'member';
    joinedAt: Date;
    lastRead: Date;
  }>;
  lastMessage?: {
    messageId: string;
    content: string;
    sender: {
      _id: string;
      username: string;
      fullName: string;
      profilePicture?: string;
    };
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

interface ChatContextType {
  socket: Socket | null;
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  setCurrentChat: (chat: Chat | null) => void;
  sendMessage: (content: string, contentType?: string, metadata?: any, replyTo?: string) => Promise<void>;
  loadMessages: (chatId: string, page?: number) => Promise<void>;
  loadChats: (page?: number) => Promise<void>;
  createChat: (type: 'direct' | 'group', participants: string[], name?: string, description?: string) => Promise<void>;
  updateChat: (chatId: string, updates: Partial<Chat>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  addParticipant: (chatId: string, userId: string, role?: 'admin' | 'member') => Promise<void>;
  removeParticipant: (chatId: string, userId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('accessToken');
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
      });

      newSocket.on('error', (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error. Please try again.');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  // Load initial chats
  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  // Join chats when current chat changes
  useEffect(() => {
    if (socket && currentChat) {
      socket.emit('join-chats', [currentChat._id]);
    }
  }, [socket, currentChat]);

  const loadChats = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setChats(data.chats);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string, page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}/messages?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, contentType = 'text', metadata?: any, replyTo?: string) => {
    if (!socket || !currentChat) return;

    try {
      socket.emit('send-message', {
        chatId: currentChat._id,
        content,
        contentType,
        metadata,
        replyTo
      });
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to send message');
    }
  };

  const createChat = async (type: 'direct' | 'group', participants: string[], name?: string, description?: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          type,
          participants,
          name,
          description
        })
      });
      const data = await response.json();
      if (data.success) {
        setChats(prev => [...prev, data.chat]);
        toast.success('Chat created successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to create chat');
    }
  };

  const updateChat = async (chatId: string, updates: Partial<Chat>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (data.success) {
        setChats(prev => prev.map(chat => 
          chat._id === chatId ? { ...chat, ...data.chat } : chat
        ));
        toast.success('Chat updated successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to update chat');
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        if (currentChat?._id === chatId) {
          setCurrentChat(null);
        }
        toast.success('Chat deleted successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to delete chat');
    }
  };

  const addParticipant = async (chatId: string, userId: string, role: 'admin' | 'member' = 'member') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ userId, role })
      });
      const data = await response.json();
      if (data.success) {
        setChats(prev => prev.map(chat => 
          chat._id === chatId ? data.chat : chat
        ));
        toast.success('Participant added successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to add participant');
    }
  };

  const removeParticipant = async (chatId: string, userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}/participants`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (data.success) {
        setChats(prev => prev.map(chat => 
          chat._id === chatId ? data.chat : chat
        ));
        toast.success('Participant removed successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to remove participant');
    }
  };

  const editMessage = async (messageId: string, content: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ content })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => prev.map(message => 
          message._id === messageId ? { ...message, content, isEdited: true } : message
        ));
        toast.success('Message edited successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to edit message');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => prev.map(message => 
          message._id === messageId ? { ...message, isDeleted: true } : message
        ));
        toast.success('Message deleted successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to delete message');
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ emoji })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => prev.map(message => 
          message._id === messageId ? data.message : message
        ));
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to add reaction');
    }
  };

  const removeReaction = async (messageId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/messages/${messageId}/reactions`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => prev.map(message => 
          message._id === messageId ? data.message : message
        ));
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to remove reaction');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        chats,
        currentChat,
        messages,
        loading,
        error,
        setCurrentChat,
        sendMessage,
        loadMessages,
        loadChats,
        createChat,
        updateChat,
        deleteChat,
        addParticipant,
        removeParticipant,
        editMessage,
        deleteMessage,
        addReaction,
        removeReaction
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 