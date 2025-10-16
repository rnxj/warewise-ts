import { Bell, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { AccountDialog } from '@/components/auth/account-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

type HeaderProps = {
  className?: string;
  onMobileMenuToggle?: () => void;
};

export function Header({ className, onMobileMenuToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = authClient.useSession();

  const user = session?.user;
  const fallbackText = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between border-border border-b bg-background px-6',
        className
      )}
    >
      {/* Left side - Mobile menu button and search */}
      <div className="flex items-center gap-4">
        <Button
          className="lg:hidden"
          onClick={onMobileMenuToggle}
          size="icon"
          variant="ghost"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-64 border-0 bg-muted/50 pl-9 focus-visible:ring-1 focus-visible:ring-ring"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            value={searchQuery}
          />
        </div>
      </div>

      {/* Right side - Notifications and user menu */}
      <div className="flex items-center gap-2">
        <Button className="relative" size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
          <span className="-top-1 -right-1 absolute h-3 w-3 rounded-full bg-destructive" />
        </Button>

        <AccountDialog>
          <Button className="flex items-center gap-2 px-3" variant="ghost">
            <Avatar className="h-8 w-8">
              <AvatarImage
                alt={user?.name || 'User'}
                src={user?.image || undefined}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {fallbackText}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start sm:flex">
              <span className="font-medium text-sm">
                {user?.name || 'User'}
              </span>
              <span className="text-muted-foreground text-xs">Online</span>
            </div>
          </Button>
        </AccountDialog>
      </div>
    </header>
  );
}
