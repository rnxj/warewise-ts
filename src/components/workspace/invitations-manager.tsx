import { format } from 'date-fns';
import {
  Check,
  Copy,
  CreditCard,
  Crown,
  Mail,
  Package,
  Shield,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authClient } from '@/lib/auth/client';

type InvitationsResponse = Awaited<
  ReturnType<typeof authClient.organization.listInvitations>
>;
type Invitation = NonNullable<InvitationsResponse['data']>[number];

export function InvitationsManager() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [showOnlyPending, setShowOnlyPending] = useState(true);
  const [copiedInvitationId, setCopiedInvitationId] = useState<string | null>(
    null
  );
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgId = activeOrg?.id;

  const loadInvitations = React.useCallback(async () => {
    setIsLoadingInvitations(true);
    try {
      const { data, error } = await authClient.organization.listInvitations();
      if (error) {
        toast.error('Failed to load invitations');
        return;
      }
      setInvitations(data || []);
    } catch (_error) {
      toast.error('Failed to load invitations');
    } finally {
      setIsLoadingInvitations(false);
    }
  }, []);

  // Filter invitations based on toggle
  const filteredInvitations = React.useMemo(() => {
    if (showOnlyPending) {
      return invitations.filter(
        (invitation) => invitation.status === 'pending'
      );
    }
    return invitations;
  }, [invitations, showOnlyPending]);

  // Load data on mount and when active organization changes
  React.useEffect(() => {
    if (!orgId) {
      return;
    }
    loadInvitations();
  }, [loadInvitations, orgId]);

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await authClient.organization.cancelInvitation({
        invitationId,
      });

      if (error) {
        toast.error(error.message || 'Failed to cancel invitation');
        return;
      }

      toast.success('Invitation cancelled successfully!');
      loadInvitations();
    } catch (_error) {
      toast.error('Failed to cancel invitation');
    }
  };

  const handleShareInvitation = async (invitationId: string) => {
    const currentUrl = window.location.origin;
    const inviteLink = `${currentUrl}/accept-invitation/${invitationId}`;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedInvitationId(invitationId);
      toast.success('Invitation link copied to clipboard!');

      // Reset the icon after 2 seconds
      setTimeout(() => {
        setCopiedInvitationId(null);
      }, 2000);
    } catch (_error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedInvitationId(invitationId);
      toast.success('Invitation link copied to clipboard!');

      // Reset the icon after 2 seconds
      setTimeout(() => {
        setCopiedInvitationId(null);
      }, 2000);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />;
      case 'biller':
        return <CreditCard className="h-4 w-4" />;
      case 'inventoryManager':
        return <Package className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'biller':
        return 'Biller';
      case 'inventoryManager':
        return 'Inventory Manager';
      default:
        return 'Inventory Manager'; // Default to inventory manager since we removed member role
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default' as const;
      case 'biller':
        return 'secondary' as const;
      case 'inventoryManager':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary' as const;
      case 'accepted':
        return 'default' as const;
      case 'canceled':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <div className="border-b bg-muted/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <h3 className="font-semibold">Invitations</h3>
            </div>
            <p className="mt-1 hidden text-muted-foreground text-sm lg:block">
              Manage workspace invitations and their status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="font-medium text-sm" htmlFor="pending-toggle">
                Show only pending
              </label>
              <Switch
                checked={showOnlyPending}
                id="pending-toggle"
                onCheckedChange={setShowOnlyPending}
              />
            </div>
          </div>
        </div>
      </div>
      {isLoadingInvitations ? (
        <div className="flex h-32 items-center justify-center">
          <Loader />
        </div>
      ) : filteredInvitations.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {showOnlyPending
              ? 'No pending invitations found.'
              : 'No invitations found.'}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11">Email</TableHead>
              <TableHead className="h-11">Role</TableHead>
              <TableHead className="h-11">Status</TableHead>
              <TableHead className="h-11">Expires</TableHead>
              <TableHead className="h-11 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvitations.map((invitation: Invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{invitation.email}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge
                    className="flex w-fit items-center gap-1"
                    variant={getRoleBadgeVariant(invitation.role)}
                  >
                    {getRoleIcon(invitation.role)}
                    {getRoleLabel(invitation.role)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge
                    className="flex w-fit items-center gap-1"
                    variant={getStatusBadgeVariant(invitation.status)}
                  >
                    {getStatusLabel(invitation.status)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                  {format(new Date(invitation.expiresAt), 'PPP')}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {invitation.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleShareInvitation(invitation.id)}
                          size="sm"
                          title={
                            copiedInvitationId === invitation.id
                              ? 'Copied!'
                              : 'Share invitation'
                          }
                          variant="ghost"
                        >
                          {copiedInvitationId === invitation.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleCancelInvitation(invitation.id)}
                          size="sm"
                          title="Cancel invitation"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
