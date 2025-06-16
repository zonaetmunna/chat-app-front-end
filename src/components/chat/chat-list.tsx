"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiClient } from '@/lib/api-client';
import { socketClient } from '@/lib/socket-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string;
  lastMessage?: {
    content: string;
    sender: {
      username: string;
    };
    timestamp: string;
  };
  participants: Array<{
    id: string;
    username: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
  }>;
}

export function ChatList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: chats, isLoading } = useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: () => apiClient.get('/chats').then(res => res.data)
  });

  useEffect(() => {
    socketClient.onMessage((message) => {
      queryClient.setQueryData<Chat[]>(['chats'], (old = []) => {
        const chatIndex = old.findIndex(chat => chat.id === message.chatId);
        if (chatIndex === -1) return old;

        const updatedChats = [...old];
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          lastMessage: {
            content: message.content,
            sender: {
              username: message.sender.username,
            },
            timestamp: message.createdAt,
          },
        };

        // Move the updated chat to the top
        const [updatedChat] = updatedChats.splice(chatIndex, 1);
        return [updatedChat, ...updatedChats];
      });
    });

    socketClient.onUserStatus(({ userId, status }) => {
      queryClient.setQueryData<Chat[]>(['chats'], (old = []) =>
        old.map(chat => ({
          ...chat,
          participants: chat.participants.map(participant =>
            participant.id === userId
              ? { ...participant, status }
              : participant
          ),
        }))
      );
    });
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-2">
        {chats?.map((chat) => (
          <button
            key={chat.id}
            onClick={() => router.push(`/chat/${chat.id}`)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
          >
            <Avatar>
              <AvatarImage
                src={
                  chat.type === 'direct'
                    ? chat.participants[0]?.avatar
                    : undefined
                }
              />
              <AvatarFallback>
                {chat.type === 'direct'
                  ? chat.participants[0]?.username?.[0]?.toUpperCase()
                  : chat.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">
                  {chat.type === 'direct'
                    ? chat.participants[0]?.username
                    : chat.name}
                </p>
                {chat.lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(chat.lastMessage.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>
              {chat.lastMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage.sender.username}: {chat.lastMessage.content}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
} 