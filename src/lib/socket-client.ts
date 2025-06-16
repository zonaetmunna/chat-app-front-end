import { io, Socket } from "socket.io-client";

class SocketClient {
  private static instance: SocketClient;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
      auth: {
        token,
      },
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onMessage(callback: (message: any) => void) {
    this.socket?.on("message", callback);
  }

  onTyping(callback: (data: { chatId: string; userId: string; isTyping: boolean }) => void) {
    this.socket?.on("typing", callback);
  }

  onUserStatus(callback: (data: { userId: string; status: "online" | "offline" | "away" }) => void) {
    this.socket?.on("user_status", callback);
  }

  sendMessage(chatId: string, content: string) {
    this.socket?.emit("message", { chatId, content });
  }

  sendTyping(chatId: string, isTyping: boolean) {
    this.socket?.emit("typing", { chatId, isTyping });
  }

  joinChat(chatId: string) {
    this.socket?.emit("join_chat", { chatId });
  }

  leaveChat(chatId: string) {
    this.socket?.emit("leave_chat", { chatId });
  }
}

export const socketClient = SocketClient.getInstance(); 