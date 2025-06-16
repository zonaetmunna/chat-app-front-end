"use client";

import { apiClient } from "@/lib/api-client";
import { createContext, useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'away' | 'offline';
  lastSeen?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await apiClient.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });
      const { token: authToken, user: userData } = response.data;
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await apiClient.post("/auth/register", {
        username,
        email,
        password,
      });
      const { token: authToken, user: userData } = response.data;
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const response = await apiClient.patch("/users/profile", data);
      setUser(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Profile update failed");
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        error, 
        login, 
        register, 
        logout,
        updateProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 