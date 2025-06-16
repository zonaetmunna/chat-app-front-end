'use client';

import { Button } from '@/components/ui/button';
import type { Chat, ChatMessage } from '@/types/chat';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Chat Message Component
interface MessageProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  senderAvatar?: string;
  senderName?: string;
}

function ChatMessage({ message, isCurrentUser, senderAvatar, senderName }: MessageProps) {
  return (
    <div
      className={`flex ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {!isCurrentUser && senderName && (
          <p className="text-xs font-medium mb-1">{senderName}</p>
        )}
        {message.replyTo && (
          <div className="mb-1 p-2 rounded bg-background/50 text-sm">
            <p className="font-medium">
              {message.replyTo.sender.fullName}
            </p>
            <p className="text-muted-foreground">
              {message.replyTo.content}
            </p>
          </div>
        )}
        <p>{message.content}</p>
        <div className="flex items-center justify-end space-x-2 mt-1">
          {message.isEdited && (
            <span className="text-xs text-muted-foreground">edited</span>
          )}
          {/* <span className="text-xs text-muted-foreground">
            {formatRelativeTime(new Date(message.createdAt))}
          </span> */}
        </div>
      </div>
    </div>
  );
}

// Chat Window Component
interface ChatWindowProps {
  chat: Chat;
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

function ChatWindow({ chat, messages, currentUserId, onSendMessage }: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (messageText) {
      setIsTyping(true);
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    } else {
      setIsTyping(false);
    }

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [messageText]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b">
        <div className="relative mr-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {chat.picture ? (
              <Image
                src={chat.picture}
                alt={chat.name || chat.participants[0].userId.fullName}
                className="w-full h-full rounded-full object-cover"
                fill
              />
            ) : (
              <span className="text-lg font-semibold">
                {chat.type === 'direct'
                  ? chat.participants[0].userId.fullName[0]
                  : chat.name?.[0]}
              </span>
            )}
          </div>
          {chat.type === 'direct' && (
            <div
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
                chat.participants[0].userId.status === 'online'
                  ? 'bg-green-500'
                  : chat.participants[0].userId.status === 'away'
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
              }`}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">
            {chat.type === 'direct'
              ? chat.participants[0].userId.fullName
              : chat.name}
          </h3>
          {chat.type === 'direct' && (
            <p className="text-sm text-muted-foreground">
              {chat.participants[0].userId.status === 'online'
                ? 'Online'
                : chat.participants[0].userId.status === 'away'
                ? 'Away'
                : 'Offline'}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={message}
              isCurrentUser={message.sender._id === currentUserId}
              senderAvatar={message.sender._id !== currentUserId ? chat.picture : undefined}
              senderName={chat.type === 'group' && message.sender._id !== currentUserId ? message.sender.fullName : undefined}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="px-4 py-2">
          <div className="text-xs text-muted-foreground">
            {chat.type === 'direct'
              ? chat.participants[0].userId.fullName
              : chat.name} is typing...
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-muted rounded-lg">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full bg-transparent border-none resize-none p-3 focus:outline-none"
              rows={1}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            size="icon"
            className="rounded-full"
          >
            <PaperPlaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Chat List Component
interface ChatListProps {
  chats: Chat[];
  currentChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

function ChatList({ chats, currentChat, onSelectChat }: ChatListProps) {
  return (
    <>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        {chats.map((chat) => (
          <button
            key={chat._id}
            className={`w-full p-4 hover:bg-muted/60 transition-colors ${
              currentChat?._id === chat._id ? 'bg-muted' : ''
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {chat.picture ? (
                    <Image
                      src={chat.picture}
                      alt={chat.name || chat.participants[0].userId.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {chat.type === 'direct'
                        ? chat.participants[0].userId.fullName[0]
                        : chat.name?.[0]}
                    </span>
                  )}
                </div>
                {chat.type === 'direct' && (
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                      chat.participants[0].userId.status === 'online'
                        ? 'bg-green-500'
                        : chat.participants[0].userId.status === 'away'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">
                    {chat.type === 'direct'
                      ? chat.participants[0].userId.fullName
                      : chat.name}
                  </p>
                  {chat.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {/* {formatRelativeTime(new Date(chat.lastMessage.timestamp))} */}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export { ChatList, ChatMessage, ChatWindow };

