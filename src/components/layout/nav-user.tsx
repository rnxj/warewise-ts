import { Link } from '@tanstack/react-router';
import { ChevronsUpDown, User } from 'lucide-react';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth/client';

export function NavUser() {
  const { isMobile, state } = useSidebar();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Skeleton
            className={
              state === 'collapsed'
                ? 'h-8 w-8 rounded-lg'
                : 'h-12 w-full rounded-lg'
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!session) {
    return null;
  }

  const initials =
    session.user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={(props) => (
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
                {...props}
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    alt={session.user.name || ''}
                    src={session.user.image || ''}
                  />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session.user.name}
                  </span>
                  <span className="truncate text-xs">{session.user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          />
          <MenuPopup
            align="end"
            className="w-56 min-w-56 rounded-lg"
            sideOffset={isMobile ? 4 : 8}
          >
            <MenuGroup>
              <MenuGroupLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      alt={session.user.name || ''}
                      src={session.user.image || ''}
                    />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session.user.email}
                    </span>
                  </div>
                </div>
              </MenuGroupLabel>
            </MenuGroup>
            <MenuSeparator />
            <MenuItem
              render={(props) => (
                <Link className="cursor-pointer" to="/profile" {...props}>
                  <User />
                  Profile
                </Link>
              )}
            />
            <MenuSeparator />
            <SignOutButton asChild="dropdown" variant="destructive" />
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
