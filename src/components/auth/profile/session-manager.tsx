import { Loader2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';

// Infer types from Better Auth
type Session = typeof authClient.$Infer.Session;
type SessionItem = Session['session'];

// Custom hook to fetch sessions once
function useSessionsData() {
  const [sessions, setSessions] = useState<SessionItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchStartedRef = useRef(false);

  // Start fetch on first render without useEffect
  if (!fetchStartedRef.current) {
    fetchStartedRef.current = true;
    authClient
      .listSessions()
      .then((response) => {
        if (response.data) {
          setSessions(response.data);
        }
      })
      .catch(() => {
        toast.error('Failed to fetch sessions');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const refetch = async () => {
    try {
      const response = await authClient.listSessions();
      if (response.data) {
        setSessions(response.data);
      }
    } catch {
      toast.error('Failed to refresh sessions');
    }
  };

  return { sessions, isLoading, refetch };
}

export function SessionManager() {
  const {
    sessions,
    isLoading: isLoadingSessions,
    refetch: fetchSessions,
  } = useSessionsData();
  const [sessionToRevoke, setSessionToRevoke] = useState<SessionItem | null>(
    null
  );
  const [isRevoking, setIsRevoking] = useState(false);

  // Use the built-in useSession hook for current session
  const { data: currentSession, isPending: isLoadingCurrentSession } =
    authClient.useSession();

  const getDeviceIcon = (userAgent?: string | null) => {
    if (!userAgent) {
      return <Monitor className="h-4 w-4 text-muted-foreground" />;
    }

    const ua = userAgent.toLowerCase();
    if (
      ua.includes('mobile') ||
      ua.includes('android') ||
      ua.includes('iphone')
    ) {
      return <Smartphone className="h-4 w-4 text-muted-foreground" />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="h-4 w-4 text-muted-foreground" />;
    }
    return <Monitor className="h-4 w-4 text-muted-foreground" />;
  };

  const getDeviceType = (ua: string) => {
    if (ua.includes('mobile') || ua.includes('android')) {
      return 'Mobile';
    }
    if (ua.includes('iphone')) {
      return 'iPhone';
    }
    if (ua.includes('ipad')) {
      return 'iPad';
    }
    if (ua.includes('tablet')) {
      return 'Tablet';
    }
    if (ua.includes('mac')) {
      return 'macOS';
    }
    if (ua.includes('windows')) {
      return 'Windows';
    }
    if (ua.includes('linux')) {
      return 'Linux';
    }
    return 'Desktop';
  };

  const getBrowserType = (ua: string) => {
    if (ua.includes('chrome')) {
      return 'Chrome';
    }
    if (ua.includes('firefox')) {
      return 'Firefox';
    }
    if (ua.includes('safari')) {
      return 'Safari';
    }
    if (ua.includes('edge')) {
      return 'Edge';
    }
    return null;
  };

  const getDeviceInfo = (userAgent?: string | null) => {
    if (!userAgent) {
      return 'Unknown Device';
    }

    const ua = userAgent.toLowerCase();
    const device = getDeviceType(ua);
    const browser = getBrowserType(ua);

    return browser ? `${device}, ${browser}` : device;
  };

  const isCurrentSession = (sessionId: string) => {
    return sessionId === currentSession?.session?.id;
  };

  const getSessionActionText = (sessionId: string) => {
    return isCurrentSession(sessionId) ? 'Sign Out' : 'Revoke';
  };

  const handleRevokeSession = async (session: SessionItem) => {
    setIsRevoking(true);
    try {
      await authClient.revokeSession({
        token: session.token,
      });
      toast.success('Session revoked successfully');
      await fetchSessions();
    } catch {
      toast.error('Failed to revoke session');
    } finally {
      setIsRevoking(false);
      setSessionToRevoke(null);
    }
  };

  const isLoading = isLoadingCurrentSession || isLoadingSessions;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const activeSessions =
    sessions?.filter((s) => new Date(s.expiresAt) > new Date()) || [];

  const currentSessionId = currentSession?.session?.id;
  const currentSessionItem = activeSessions.find(
    (s) => s.id === currentSessionId
  );
  const otherSessions = activeSessions.filter((s) => s.id !== currentSessionId);

  if (activeSessions.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-muted-foreground text-sm">
          Active Sessions
        </h3>
        <p className="py-4 text-center text-muted-foreground text-sm">
          No active sessions found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-muted-foreground text-sm">
        Active Sessions
      </h3>

      <div className="space-y-3">
        {currentSessionItem && (
          <div className="flex items-center justify-between rounded-lg border bg-muted/10 p-3">
            <div className="flex items-center gap-3">
              {getDeviceIcon(currentSessionItem.userAgent)}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {getDeviceInfo(currentSessionItem.userAgent)}
                  </span>
                  <Badge className="text-xs" variant="success">
                    Current session
                  </Badge>
                </div>
                {currentSessionItem.ipAddress && (
                  <p className="text-muted-foreground text-xs">
                    {currentSessionItem.ipAddress}
                  </p>
                )}
              </div>
            </div>
            <Button
              className="text-destructive hover:text-destructive"
              onClick={() => setSessionToRevoke(currentSessionItem)}
              variant="ghost"
            >
              {getSessionActionText(currentSessionItem.id)}
            </Button>
          </div>
        )}

        {otherSessions.map((session) => (
          <div
            className="flex items-center justify-between rounded-lg border p-3"
            key={session.id}
          >
            <div className="flex items-center gap-3">
              {getDeviceIcon(session.userAgent)}
              <div className="space-y-0.5">
                <span className="font-medium text-sm">
                  {getDeviceInfo(session.userAgent)}
                </span>
                {session.ipAddress && (
                  <p className="text-muted-foreground text-xs">
                    {session.ipAddress}
                  </p>
                )}
              </div>
            </div>
            <Button
              className="text-destructive hover:text-destructive"
              onClick={() => setSessionToRevoke(session)}
              variant="ghost"
            >
              {getSessionActionText(session.id)}
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog
        onOpenChange={() => setSessionToRevoke(null)}
        open={!!sessionToRevoke}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {sessionToRevoke && isCurrentSession(sessionToRevoke.id)
                ? 'Sign out of this session?'
                : 'Revoke this session?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {sessionToRevoke && isCurrentSession(sessionToRevoke.id)
                ? 'You will be signed out from this device and redirected to the login page.'
                : 'This device will be signed out immediately and will need to sign in again to access the account.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose>Cancel</AlertDialogClose>
            <AlertDialogClose
              disabled={isRevoking}
              onClick={() => {
                if (sessionToRevoke) {
                  if (isCurrentSession(sessionToRevoke.id)) {
                    authClient.signOut().then(() => {
                      window.location.href = '/auth/login';
                    });
                  } else {
                    handleRevokeSession(sessionToRevoke);
                  }
                }
              }}
            >
              {isRevoking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {sessionToRevoke && isCurrentSession(sessionToRevoke.id)
                    ? 'Signing out...'
                    : 'Revoking...'}
                </>
              ) : (
                sessionToRevoke && getSessionActionText(sessionToRevoke.id)
              )}
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
