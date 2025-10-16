import { Link } from '@tanstack/react-router';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import type * as React from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

export function NavMain({
  items,
  currentPath,
}: {
  items: NavItem[];
  currentPath: string;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Recursive function to render dropdown menu items
  const renderDropdownItems = (menuItems: NavItem[]): React.ReactNode => {
    return menuItems.map((item) => {
      const isItemActive =
        currentPath === item.url || currentPath.startsWith(`${item.url}/`);

      // If this item has nested items, render as a submenu
      if (item.items && item.items.length > 0) {
        return (
          <DropdownMenuSub key={item.title}>
            <DropdownMenuSubTrigger className={cn(isItemActive && 'bg-accent')}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              <span>{item.title}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderDropdownItems(item.items)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      }

      // Otherwise render as a regular menu item
      return (
        <DropdownMenuItem asChild key={item.title}>
          <Link
            className={cn('cursor-pointer', isItemActive && 'bg-accent')}
            to={item.url}
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            <span>{item.title}</span>
          </Link>
        </DropdownMenuItem>
      );
    });
  };

  // Recursive function to check if any child is active
  const hasActiveDescendant = (item: NavItem): boolean => {
    if (currentPath === item.url || currentPath.startsWith(`${item.url}/`)) {
      return true;
    }
    if (item.items) {
      return item.items.some(hasActiveDescendant);
    }
    return false;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = hasActiveDescendant(item);

          // If item has sub-items and sidebar is collapsed, render as dropdown
          if (item.items && item.items.length > 0 && isCollapsed) {
            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="right">
                    {renderDropdownItems(item.items)}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          }

          // Normal collapsible when sidebar is expanded
          return item.items && item.items.length > 0 ? (
            <Collapsible
              asChild
              className="group/collapsible"
              defaultOpen={item.isActive || isActive}
              key={item.title}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive =
                        currentPath === subItem.url ||
                        currentPath.startsWith(`${subItem.url}/`);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubItemActive}
                          >
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
