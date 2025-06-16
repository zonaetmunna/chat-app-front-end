/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { toast } from "sonner";

interface UserSettings {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sounds: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showReadReceipts: boolean;
    showLastSeen: boolean;
  };
}

interface SettingsFormProps {
  user: UserSettings;
  onSave: (settings: UserSettings) => void;
  isLoading?: boolean;
  error?: string;
}

/**
 * SettingsForm component allows users to manage their profile and app settings
 * 
 * @param user - The current user settings
 * @param onSave - Callback function for saving settings
 * @param isLoading - Boolean indicating if a save operation is in progress
 * @param error - Error message to display if save operation failed
 * @returns A form component for managing user settings
 */
export function SettingsForm({ 
  user, 
  onSave, 
  isLoading = false,
  error
}: SettingsFormProps) {
  const [formData, setFormData] = useState<UserSettings>({ ...user });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, category?: string) => {
    setFormData(prev => {
      if (category) {
        const categoryKey = category as keyof Pick<UserSettings, 'notifications' | 'privacy'>;
        const nameKey = name as keyof (typeof prev[typeof categoryKey]);
        return {
          ...prev,
          [categoryKey]: {
            ...prev[categoryKey],
            [nameKey]: !prev[categoryKey][nameKey]
          }
        };
      } else {
        return { ...prev, [name]: name === 'theme' ? (prev.theme === 'light' ? 'dark' : 'light') : !prev[name as keyof UserSettings] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success('Settings saved.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Settings */}
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and how it appears to others.
        </p>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Contact support to change your email address.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tell others about yourself"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how the app looks and feels.
        </p>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Dark mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes.
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={formData.theme === 'dark'}
              onCheckedChange={() => handleSwitchChange('theme')}
              aria-label="Dark mode"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you want to be notified.
        </p>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important updates.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={formData.notifications.email}
              onCheckedChange={() => handleSwitchChange('email', 'notifications')}
              aria-label="Email notifications"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your device.
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={formData.notifications.push}
              onCheckedChange={() => handleSwitchChange('push', 'notifications')}
              aria-label="Push notifications"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-notifications">Notification sounds</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for new messages and notifications.
              </p>
            </div>
            <Switch
              id="sound-notifications"
              checked={formData.notifications.sounds}
              onCheckedChange={() => handleSwitchChange('sounds', 'notifications')}
              aria-label="Notification sounds"
            />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div>
        <h3 className="text-lg font-medium">Privacy</h3>
        <p className="text-sm text-muted-foreground">
          Manage your privacy settings.
        </p>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="online-status">Show online status</Label>
              <p className="text-sm text-muted-foreground">
                Let others see when you're online.
              </p>
            </div>
            <Switch
              id="online-status"
              checked={formData.privacy.showOnlineStatus}
              onCheckedChange={() => handleSwitchChange('showOnlineStatus', 'privacy')}
              aria-label="Show online status"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="read-receipts">Show read receipts</Label>
              <p className="text-sm text-muted-foreground">
                Let others know when you've read their messages.
              </p>
            </div>
            <Switch
              id="read-receipts"
              checked={formData.privacy.showReadReceipts}
              onCheckedChange={() => handleSwitchChange('showReadReceipts', 'privacy')}
              aria-label="Show read receipts"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="last-seen">Show last seen</Label>
              <p className="text-sm text-muted-foreground">
                Let others see when you were last active.
              </p>
            </div>
            <Switch
              id="last-seen"
              checked={formData.privacy.showLastSeen}
              onCheckedChange={() => handleSwitchChange('showLastSeen', 'privacy')}
              aria-label="Show last seen"
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}

      {/* Form actions */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
} 