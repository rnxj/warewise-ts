import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type NavigationItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
};

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    icon: Home,
    href: '/dashboard',
  },
];

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:flex lg:flex-col lg:border-border lg:border-r lg:bg-background',
          isCollapsed ? 'lg:w-16' : 'lg:w-64',
          'transition-all duration-300 ease-in-out',
          className
        )}
      >
        <div className="flex h-16 items-center justify-between border-border border-b px-6">
          {!isCollapsed && (
            <h1 className="font-semibold text-foreground text-xl tracking-tight">
              Dashboard
            </h1>
          )}
          <Button
            className="h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="icon"
            variant="ghost"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive =
                currentPath === item.href ||
                (item.href !== '/dashboard' &&
                  currentPath.startsWith(item.href));

              return (
                <Button
                  className={cn(
                    'h-10 w-full justify-start gap-3',
                    isCollapsed && 'justify-center px-2',
                    isActive && 'bg-primary text-primary-foreground shadow-sm',
                    !isActive &&
                      'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                  key={item.name}
                  onClick={() => navigate({ to: item.href })}
                  variant={isActive ? 'default' : 'ghost'}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="border-border border-t p-4">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2',
              isCollapsed && 'justify-center'
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
              U
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-medium text-foreground text-sm">
                  User
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  user@example.com
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile implementation can be added here with a sheet/drawer */}
      </div>
    </>
  );
}
