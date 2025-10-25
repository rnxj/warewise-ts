import { Link } from '@tanstack/react-router';
import { Building2, Check, ChevronsUpDown, Cog, Plus } from 'lucide-react';
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

export function OrgSwitcher() {
  const { isMobile, state } = useSidebar();
  const { data: activeOrg, isPending: isActiveOrgPending } =
    authClient.useActiveOrganization();
  const { data: orgs, isPending: isOrgsPending } =
    authClient.useListOrganizations();

  const isPending = isActiveOrgPending || isOrgsPending;

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

  const getOrgInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

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
                {activeOrg ? (
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      {activeOrg.logo ? (
                        <AvatarImage
                          alt={activeOrg.name}
                          src={activeOrg.logo}
                        />
                      ) : null}
                      <AvatarFallback className="rounded-lg">
                        {getOrgInitials(activeOrg.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {activeOrg.name}
                      </span>
                      <span className="truncate text-xs">Workspace</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        Select workspace
                      </span>
                      <span className="truncate text-xs">
                        No workspace selected
                      </span>
                    </div>
                  </>
                )}
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          />
          <MenuPopup
            align="start"
            className="w-56 min-w-56 rounded-lg"
            sideOffset={isMobile ? 4 : 8}
          >
            <MenuGroup>
              <MenuGroupLabel className="text-muted-foreground text-xs">
                Workspaces
              </MenuGroupLabel>
              {orgs?.map((org) => (
                <MenuItem
                  className="gap-2"
                  key={org.id}
                  onClick={async () => {
                    await authClient.organization.setActive({
                      organizationId: org.id,
                    });
                  }}
                >
                  <Avatar className="h-4 w-4 rounded-sm">
                    {org.logo ? (
                      <AvatarImage alt={org.name} src={org.logo} />
                    ) : null}
                    <AvatarFallback className="rounded-sm text-xs">
                      {getOrgInitials(org.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{org.name}</span>
                      {activeOrg?.id === org.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                </MenuItem>
              ))}
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuItem
                render={(props) => (
                  <Link className="gap-2 p-2" to="/workspace/create" {...props}>
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Create workspace</span>
                  </Link>
                )}
              />
            </MenuGroup>
            {activeOrg && (
              <>
                <MenuSeparator />
                <MenuGroup>
                  <MenuItem
                    render={(props) => (
                      <Link
                        className="gap-2 p-2"
                        to="/workspace/settings"
                        {...props}
                      >
                        <Cog />
                        <span className="text-sm">Workspace settings</span>
                      </Link>
                    )}
                  />
                </MenuGroup>
              </>
            )}
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
