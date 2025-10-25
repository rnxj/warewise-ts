import { Link } from '@tanstack/react-router';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import type * as React from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from '@/components/ui/menu';
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
          <MenuSub key={item.title}>
            <MenuSubTrigger className={cn(isItemActive && 'bg-accent')}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              <span>{item.title}</span>
            </MenuSubTrigger>
            <MenuSubPopup>{renderDropdownItems(item.items)}</MenuSubPopup>
          </MenuSub>
        );
      }

      // Otherwise render as a regular menu item
      return (
        <MenuItem
          key={item.title}
          render={(props) => (
            <Link
              className={cn('cursor-pointer', isItemActive && 'bg-accent')}
              to={item.url}
              {...props}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              <span>{item.title}</span>
            </Link>
          )}
        />
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
                <Menu>
                  <MenuTrigger
                    render={(props) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        {...props}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  />
                  <MenuPopup align="start">
                    {renderDropdownItems(item.items)}
                  </MenuPopup>
                </Menu>
              </SidebarMenuItem>
            );
          }

          // Normal collapsible when sidebar is expanded
          return item.items && item.items.length > 0 ? (
            <SidebarMenuItem key={item.title}>
              <Collapsible
                className="group/collapsible"
                defaultOpen={item.isActive || isActive}
              >
                <CollapsibleTrigger
                  render={(props) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      {...props}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  )}
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive =
                        currentPath === subItem.url ||
                        currentPath.startsWith(`${subItem.url}/`);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={isSubItemActive}
                            render={(props) => (
                              <Link to={subItem.url} {...props}>
                                <span>{subItem.title}</span>
                              </Link>
                            )}
                          />
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive}
                render={(props) => (
                  <Link to={item.url} {...props}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                )}
                tooltip={item.title}
              />
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
