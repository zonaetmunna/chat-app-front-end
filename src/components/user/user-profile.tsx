import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, EnvelopeClosedIcon, HomeIcon } from '@radix-ui/react-icons';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: Date;
  isOnline: boolean;
}

interface UserProfileProps {
  user: User;
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
  onSendMessage?: (userId: string) => void;
}

/**
 * UserProfile component displays detailed information about a user
 * 
 * @param user - The user object containing profile information
 * @param isCurrentUser - Boolean indicating if this is the current logged-in user's profile
 * @param onEditProfile - Callback function for editing the profile
 * @param onSendMessage - Callback function for sending a message to this user
 * @returns A component displaying user information and appropriate action buttons
 */
export function UserProfile({ 
  user, 
  isCurrentUser = false,
  onEditProfile,
  onSendMessage
}: UserProfileProps) {
  // Format join date to display month and year
  const formatJoinDate = (date: Date) => {
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-background rounded-lg shadow-md">
      {/* Profile header with avatar and online status */}
      <div className="relative mb-4">
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
        <span 
          data-testid="online-status"
          className={cn(
            "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background",
            user.isOnline ? "bg-green-500 online" : "bg-gray-400 offline"
          )}
        />
      </div>
      
      {/* User name and online status text */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-sm text-muted-foreground">
          {user.isOnline ? "Online" : "Offline"}
        </p>
      </div>
      
      {/* User email */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <EnvelopeClosedIcon className="h-4 w-4 text-muted-foreground" />
        <span>{user.email}</span>
      </div>
      
      {/* User location if available */}
      {user.location && (
        <div className="flex items-center gap-2 mb-2 text-sm">
          <HomeIcon className="h-4 w-4 text-muted-foreground" />
          <span>{user.location}</span>
        </div>
      )}
      
      {/* Join date */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <span>{formatJoinDate(user.joinDate)}</span>
      </div>
      
      {/* User bio */}
      {user.bio && (
        <div className="mb-6 text-center">
          <p className="text-sm">{user.bio}</p>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex gap-2">
        {isCurrentUser ? (
          <Button 
            onClick={onEditProfile}
            variant="outline"
          >
            Edit Profile
          </Button>
        ) : (
          <Button 
            onClick={() => onSendMessage?.(user.id)}
            variant="default"
          >
            Message
          </Button>
        )}
      </div>
    </div>
  );
} 