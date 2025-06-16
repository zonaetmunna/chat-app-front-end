import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  PaperPlaneIcon,
  ThickArrowUpIcon,
} from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { EmojiPicker } from "./emoji-picker";
import { FileUpload } from "./file-upload";

interface MessageInputProps {
  onSend: (message: string) => void;
  onFileUpload: (file: File) => void;
  className?: string;
}

export function MessageInput({ onSend, onFileUpload, className }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <div className={cn("p-4 border-t border-border", className)}>
      <div className="flex items-end gap-2">
        <EmojiPicker onChange={handleEmojiSelect} />
        <FileUpload onUpload={onFileUpload} />
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-[120px] resize-none pr-12"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMessage("")}
            >
              <ThickArrowUpIcon className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            className="h-10 w-10"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <PaperPlaneIcon className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 