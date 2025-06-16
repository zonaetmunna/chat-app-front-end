import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Cross2Icon,
  ImageIcon,
  Link2Icon,
  StarIcon,
} from "@radix-ui/react-icons";

interface UserInfoSidebarProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    phone: string;
    username: string;
  };
  onClose: () => void;
  className?: string;
}

export function UserInfoSidebar({
  user,
  onClose,
  className,
}: UserInfoSidebarProps) {
  return (
    <div
      className={cn(
        "w-80 border-l border-border bg-background flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        <h2 className="font-semibold">User Info</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Cross2Icon className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* User profile */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <Button variant="outline" className="w-full">
              <StarIcon className="h-4 w-4 mr-2" />
              Add to Favorites
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="info" className="flex-1">
                Info
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1">
                Media
              </TabsTrigger>
              <TabsTrigger value="links" className="flex-1">
                Links
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Bio</h4>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Phone</h4>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="media" className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                  >
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="links" className="mt-4">
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                  >
                    <Link2Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">example.com/link{i}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Shared 2 days ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
} 