"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { apiClient } from "@/lib/api-client";
import { socketClient } from "@/lib/socket-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  readBy: string[];
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  participants: Array<{
    id: string;
    username: string;
    avatar?: string;
  }>;
}

export default function ChatDetailPage() {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: chat, isLoading: isLoadingChat } = useQuery<Chat>({
    queryKey: ["chat", chatId],
    queryFn: () => apiClient.get(`/chats/${chatId}`).then((res) => res.data),
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: () => apiClient.get(`/chats/${chatId}/messages`).then((res) => res.data),
  });

  useEffect(() => {
    if (chatId) {
      socketClient.joinChat(chatId as string);
    }

    return () => {
      if (chatId) {
        socketClient.leaveChat(chatId as string);
      }
    };
  }, [chatId]);

  useEffect(() => {
    socketClient.onMessage((newMessage: Message) => {
      queryClient.setQueryData<Message[]>(["messages", chatId], (old = []) => [
        ...old,
        newMessage,
      ]);
      scrollToBottom();
    });

    socketClient.onTyping(({ userId, isTyping }) => {
      // Handle typing indicator
      console.log(`User ${userId} is ${isTyping ? "typing" : "not typing"}`);
    });
  }, [chatId, queryClient]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketClient.sendTyping(chatId as string, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketClient.sendTyping(chatId as string, false);
    }, 2000);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      socketClient.sendMessage(chatId as string, message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  if (isLoadingChat || isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Chat not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback>
            {chat.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{chat.name}</h2>
          <p className="text-sm text-muted-foreground">
            {chat.participants.length} participants
          </p>
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender.id === "current-user-id" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender.id === "current-user-id"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.sender.id !== "current-user-id" && (
                  <div className="flex items-center space-x-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>
                        {message.sender.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {message.sender.username}
                    </span>
                  </div>
                )}
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
} 