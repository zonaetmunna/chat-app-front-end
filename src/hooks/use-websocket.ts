import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: 'connection' | 'message';
  clientId?: string;
  sender?: string;
  content?: string;
  timestamp?: Date;
}

interface UseWebSocketProps {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
}

export function useWebSocket({ url, onMessage }: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    ws.current = new WebSocket(url);

    // Connection opened
    ws.current.addEventListener('open', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    });

    // Listen for messages
    ws.current.addEventListener('message', (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        if (message.type === 'connection') {
          setClientId(message.clientId || null);
        }
        
        onMessage?.(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Connection closed
    ws.current.addEventListener('close', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    });

    // Connection error
    ws.current.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, onMessage]);

  const sendMessage = (content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'message',
        content,
        timestamp: new Date()
      }));
    }
  };

  return {
    isConnected,
    clientId,
    sendMessage
  };
} 