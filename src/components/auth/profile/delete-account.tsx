import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth/client';

export function DeleteAccount() {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get user session to display email
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email || '';
  const accountCreatedAt = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const resetForm = () => {
    setPassword('');
    setConfirmText('');
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await authClient.deleteUser({
        password,
      });
      toast.success('Account deleted successfully');
      // Redirect to home or login page after deletion
      window.location.href = '/';
    } catch {
      toast.error('Failed to delete account. Please check your password.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border border-destructive/50 p-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Delete profile</h3>
          <p className="text-muted-foreground text-sm">
            The account will be permanently deleted, including its workspaces
            and data. This action is irreversible and can not be undone.
          </p>
        </div>

        {userEmail && (
          <div className="space-y-1 rounded-md bg-muted/50 p-3">
            <p className="font-medium text-sm">{userEmail}</p>
            {accountCreatedAt && (
              <p className="text-muted-foreground text-xs">
                Account created on {accountCreatedAt}
              </p>
            )}
          </div>
        )}

        <AlertDialog
          onOpenChange={(open) => {
            setDialogOpen(open);
            !open && resetForm();
          }}
          open={dialogOpen}
        >
          <AlertDialogTrigger
            render={(props) => (
              <Button className="w-full" variant="destructive" {...props}>
                Delete account
              </Button>
            )}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="delete-password">Enter your password</Label>
                <Input
                  id="delete-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  value={password}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-delete">
                  Type{' '}
                  <span className="font-bold text-destructive">DELETE</span> to
                  confirm
                </Label>
                <Input
                  id="confirm-delete"
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  value={confirmText}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                disabled={isDeleting || confirmText !== 'DELETE' || !password}
                onClick={handleDeleteAccount}
                variant="destructive"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
