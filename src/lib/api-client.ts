import {
    ApiResponse,
    AuthResponse,
    Chat,
    Contact,
    Message,
    PaginatedResponse,
    User,
} from "@/types/api";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// API Client Configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Request Interceptor
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse<null>>) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await axios.post<ApiResponse<{ token: string }>>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          );

          const { token } = response.data.data;
          localStorage.setItem("token", token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// API Endpoints
export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data),
    register: (data: { username: string; email: string; password: string }) =>
      apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data),
    refreshToken: (refreshToken: string) =>
      apiClient.post<ApiResponse<{ token: string }>>("/auth/refresh", { refreshToken }),
  },
  chat: {
    getChats: () => apiClient.get<ApiResponse<Chat[]>>("/chats"),
    getChat: (chatId: string) => apiClient.get<ApiResponse<Chat>>(`/chats/${chatId}`),
    getMessages: (chatId: string, params?: { page?: number; limit?: number }) =>
      apiClient.get<ApiResponse<PaginatedResponse<Message>>>(`/chats/${chatId}/messages`, {
        params,
      }),
    sendMessage: (chatId: string, content: string) =>
      apiClient.post<ApiResponse<Message>>(`/chats/${chatId}/messages`, { content }),
    createChat: (data: { participants: string[]; name?: string; type: "direct" | "group" }) =>
      apiClient.post<ApiResponse<Chat>>("/chats", data),
  },
  user: {
    getProfile: () => apiClient.get<ApiResponse<User>>("/users/profile"),
    updateProfile: (data: Partial<User>) =>
      apiClient.patch<ApiResponse<User>>("/users/profile", data),
    getContacts: () => apiClient.get<ApiResponse<Contact[]>>("/users/contacts"),
    addContact: (userId: string) =>
      apiClient.post<ApiResponse<Contact>>(`/users/contacts/${userId}`),
    removeContact: (userId: string) =>
      apiClient.delete<ApiResponse<null>>(`/users/contacts/${userId}`),
  },
}; 