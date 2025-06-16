import { api } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Auth Hooks
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.auth.login,
    onSuccess: (response) => {
      const { token, refreshToken, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      queryClient.setQueryData(["user"], user);
      toast.success("Login successful!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.auth.register,
    onSuccess: (response) => {
      const { token, refreshToken, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      queryClient.setQueryData(["user"], user);
      toast.success("Registration successful!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
}

// Chat Hooks
export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => api.chat.getChats().then((res) => res.data.data),
  });
}

export function useChat(chatId: string) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => api.chat.getChat(chatId).then((res) => res.data.data),
    enabled: !!chatId,
  });
}

export function useMessages(chatId: string, page = 1, limit = 50) {
  return useQuery({
    queryKey: ["messages", chatId, page],
    queryFn: () =>
      api.chat.getMessages(chatId, { page, limit }).then((res) => res.data.data),
    enabled: !!chatId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      api.chat.sendMessage(chatId, content),
    onSuccess: (response, variables) => {
      const newMessage = response.data.data;
      queryClient.setQueryData(["messages", variables.chatId], (old: any) => ({
        ...old,
        data: [...(old?.data || []), newMessage],
      }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });
}

// User Hooks
export function useProfile() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => api.user.getProfile().then((res) => res.data.data),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.user.updateProfile,
    onSuccess: (response) => {
      queryClient.setQueryData(["user"], response.data.data);
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
}

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: () => api.user.getContacts().then((res) => res.data.data),
  });
}

export function useAddContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.user.addContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact added successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add contact");
    },
  });
}

export function useRemoveContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.user.removeContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove contact");
    },
  });
} 