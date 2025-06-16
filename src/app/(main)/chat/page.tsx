"use client";

import { ChatList } from '@/components/chat/chat-list';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Chats</h1>
      </div>
      <ChatList />
    </div>
  );
} 