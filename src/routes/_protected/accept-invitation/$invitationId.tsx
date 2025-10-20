import { createFileRoute, useRouter } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { authClient } from '@/lib/auth/client';

export const Route = createFileRoute(
  '/_protected/accept-invitation/$invitationId'
)({
  component: AcceptInvitationPage,
  head: () => ({
    meta: [
      {
        title: 'Accept Invitation',
      },
    ],
  }),
});

interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: 'owner' | 'biller' | 'inventoryManager';
  status: string;
  inviterId: string;
  expiresAt: Date;
  organizationName: string;
  organizationSlug: string;
  inviterEmail: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  inviter?: {
    user: {
      name: string;
      email: string;
    };
  };
}

function AcceptInvitationPage() {
  const router = useRouter();
  const { invitationId } = Route.useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const { data, error } = await authClient.organization.getInvitation({
          query: { id: invitationId },
        });

        if (error) {
          setError(error.message || 'Failed to load invitation');
          return;
        }

        if (!data) {
          setError('Invitation not found');
          return;
        }

        setInvitation(data);

        // Check if invitation is expired
        if (new Date() > new Date(data.expiresAt)) {
          setIsExpired(true);
          return;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load invitation'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitation();
  }, [invitationId]);

  const handleAccept = async () => {
    if (!invitation) {
      return;
    }

    setIsAccepting(true);
    try {
      const { error } = await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
      });

      if (error) {
        // Handle email verification requirement error
        if (
          error.message?.includes('email verification') ||
          error.message?.includes('verify')
        ) {
          toast.error(
            'Please verify your email address before accepting this invitation'
          );
        } else {
          toast.error(error.message || 'Failed to accept invitation');
        }
        return;
      }

      toast.success('Invitation accepted successfully!');
      router.navigate({ to: '/dashboard' });
    } catch (err) {
      toast.error('Failed to accept invitation', {
        description:
          err instanceof Error ? err.message : 'Failed to accept invitation',
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!invitation) {
      return;
    }

    setIsRejecting(true);
    try {
      const { error } = await authClient.organization.rejectInvitation({
        invitationId: invitation.id,
      });

      if (error) {
        // Handle email verification requirement error
        if (
          error.message?.includes('email verification') ||
          error.message?.includes('verify')
        ) {
          toast.error(
            'Please verify your email address before rejecting this invitation'
          );
        } else {
          toast.error(error.message || 'Failed to reject invitation');
        }
        return;
      }

      toast.success('Invitation rejected');
      router.navigate({ to: '/' });
    } catch (err) {
      toast.error('Failed to reject invitation', {
        description:
          err instanceof Error ? err.message : 'Failed to reject invitation',
      });
    } finally {
      setIsRejecting(false);
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
        return 'Member';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Loader />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <a
            className="flex items-center gap-2 self-center font-medium"
            href="/"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {siteConfig.name}
          </a>

          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-center text-destructive">
                Invalid Invitation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {error || 'This invitation is not valid or has been removed.'}
              </p>
              <Button
                className="mt-4 w-full"
                onClick={() => router.navigate({ to: '/' })}
              >
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <a
            className="flex items-center gap-2 self-center font-medium"
            href="/"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {siteConfig.name}
          </a>

          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-center text-destructive">
                Invitation Expired
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                This invitation has expired. Please contact the workspace owner
                for a new invitation.
              </p>
              <Button
                className="mt-4 w-full"
                onClick={() => router.navigate({ to: '/' })}
              >
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <a className="flex items-center gap-2 self-center font-medium" href="/">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {siteConfig.name}
        </a>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-center">You're Invited!</CardTitle>
            <CardDescription>
              <strong>{invitation.inviterEmail}</strong> has invited you to join{' '}
              <strong>{invitation.organizationName}</strong> as a{' '}
              <strong>{getRoleLabel(invitation.role)}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-6">
              <div className="space-y-3 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
                  {getRoleLabel(invitation.role)}
                </div>

                <p className="text-muted-foreground text-sm">
                  Your email:{' '}
                  <span className="font-medium text-foreground">
                    {invitation.email}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                disabled={isRejecting}
                onClick={handleReject}
                variant="outline"
              >
                {isRejecting ? 'Rejecting...' : 'Decline'}
              </Button>
              <Button
                className="flex-1"
                disabled={isAccepting}
                onClick={handleAccept}
              >
                {isAccepting ? 'Accepting...' : 'Accept Invitation'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
