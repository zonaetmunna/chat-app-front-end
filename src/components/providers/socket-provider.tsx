"use client";

import { useAuth } from "@/hooks/use-auth";
import { socketClient } from "@/lib/socket-client";
import { useEffect } from "react";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      socketClient.connect(token);
    } else {
      socketClient.disconnect();
    }

    return () => {
      socketClient.disconnect();
    };
  }, [token]);

  return <>{children}</>;
} 