import { createFileRoute } from '@tanstack/react-router';
import { Mail, Settings, Users } from 'lucide-react';
import { Loader } from '@/components/icons';
import { ResponsiveTabs, TabsPanel } from '@/components/ui/responsive-tabs';
import { InvitationsManager } from '@/components/workspace/invitations-manager';
import { MembersManager } from '@/components/workspace/members-manager';
import { UpdateWorkspaceInfo } from '@/components/workspace/update-workspace-info';
import { authClient } from '@/lib/auth/client';

export const Route = createFileRoute('/_protected/_sidebar/workspace/settings')(
  {
    component: WorkspaceSettingsPage,
    head: () => ({
      meta: [
        {
          title: 'Workspace Settings',
        },
      ],
    }),
  }
);

function WorkspaceSettingsPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();

  if (!activeOrg) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-bold text-2xl">Workspace Settings</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Manage your workspace settings and team
        </p>
      </div>

      <ResponsiveTabs
        defaultValue="general"
        items={[
          {
            value: 'general',
            label: 'General',
            icon: <Settings className="h-4 w-4" />,
          },
          {
            value: 'members',
            label: 'Members',
            icon: <Users className="h-4 w-4" />,
          },
          {
            value: 'invitations',
            label: 'Invitations',
            icon: <Mail className="h-4 w-4" />,
          },
        ]}
      >
        <TabsPanel className="space-y-6" value="general">
          <UpdateWorkspaceInfo
            initialLogo={activeOrg.logo || ''}
            initialName={activeOrg.name}
            initialSlug={activeOrg.slug}
          />
        </TabsPanel>

        <TabsPanel value="members">
          <MembersManager />
        </TabsPanel>

        <TabsPanel value="invitations">
          <InvitationsManager />
        </TabsPanel>
      </ResponsiveTabs>
    </div>
  );
}
