import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { Message } from "./message";

interface MessagesContainerProps {
  messages: Array<{
    id: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
    sender: {
      id: string;
      name: string;
      avatar: string;
    };
  }>;
}

export function MessagesContainer({ messages }: MessagesContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollRef} className="flex-1">
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
} 