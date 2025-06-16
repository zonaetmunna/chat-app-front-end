import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageProps {
  message: {
    id: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
    sender: {
      id: string;
      name: string;
      avatar: string;
    };
  };
}

export function Message({ message }: MessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2 mb-4",
        message.isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!message.isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          message.isOwn ? "items-end" : "items-start"
        )}
      >
        {!message.isOwn && (
          <span className="text-sm font-medium mb-1">{message.sender.name}</span>
        )}
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            message.isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {format(message.timestamp, "HH:mm")}
        </span>
      </div>
    </div>
  );
} 