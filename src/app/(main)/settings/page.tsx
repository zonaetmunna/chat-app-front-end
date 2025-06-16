"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  settings: {
    notifications: boolean;
    darkMode: boolean;
    status: "online" | "offline" | "away";
  };
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: () => apiClient.get("/users/profile").then((res) => res.data),
  });

  const updateProfile = useMutation({
    mutationFn: (data: Partial<UserProfile>) =>
      apiClient.patch("/users/profile", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast('Profile updated.');
    },
    onError: () => {
      toast('Failed to update profile.');
    },
  });

  const updateSettings = useMutation({
    mutationFn: (settings: UserProfile["settings"]) =>
      apiClient.patch("/users/settings", { settings }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await apiClient.post("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast("Avatar updated.");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Profile</h2>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.username} />
              <AvatarFallback>
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer text-sm text-primary hover:underline"
              >
                Change avatar
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) =>
                updateProfile.mutate({ username: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => updateProfile.mutate({ email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notifications</Label>
              <Switch
                id="notifications"
                checked={profile.settings.notifications}
                onCheckedChange={(checked) =>
                  updateSettings.mutate({
                    ...profile.settings,
                    notifications: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={profile.settings.darkMode}
                onCheckedChange={(checked) =>
                  updateSettings.mutate({
                    ...profile.settings,
                    darkMode: checked,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={profile.settings.status}
                onChange={(e) =>
                  updateSettings.mutate({
                    ...profile.settings,
                    status: e.target.value as UserProfile["settings"]["status"],
                  })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="online">Online</option>
                <option value="away">Away</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="destructive"
            onClick={() => {
              // Implement logout logic
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
} 