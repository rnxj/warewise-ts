import { EyeIcon, EyeOffIcon, Key, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import PasswordInput from '@/components/auth/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth/client';

export function ChangePassword() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setRevokeOtherSessions(false);
    setShowCurrentPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async () => {
    if (!(currentPassword && newPassword && confirmPassword)) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsChanging(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      });
      toast.success('Password changed successfully');
      resetForm();
      setDialogOpen(false);
    } catch {
      toast.error(
        'Failed to change password. Please check your current password.'
      );
    } finally {
      setIsChanging(false);
    }
  };

  const isFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-muted-foreground text-sm">Security</h3>

      <div className="space-y-2">
        <Dialog
          onOpenChange={(open) => {
            setDialogOpen(open);
            !open && resetForm();
          }}
          open={dialogOpen}
        >
          <DialogTrigger
            render={(props) => (
              <Button
                className="w-full justify-start"
                variant="outline"
                {...props}
              >
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            )}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    className="pe-9"
                    id="current-password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                  />
                  <button
                    aria-label={
                      showCurrentPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    type="button"
                  >
                    {showCurrentPassword ? (
                      <EyeOffIcon aria-hidden="true" size={16} />
                    ) : (
                      <EyeIcon aria-hidden="true" size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <PasswordInput
                  id="new-password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    className="pe-9"
                    id="confirm-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                  />
                  <button
                    aria-label={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon aria-hidden="true" size={16} />
                    ) : (
                      <EyeIcon aria-hidden="true" size={16} />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-destructive text-sm">
                    Passwords do not match
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={revokeOtherSessions}
                  id="revoke-sessions"
                  onCheckedChange={(checked) =>
                    setRevokeOtherSessions(checked as boolean)
                  }
                />
                <Label
                  className="cursor-pointer font-normal text-sm"
                  htmlFor="revoke-sessions"
                >
                  Sign out from all other devices
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={isChanging}
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={!isFormValid || isChanging}
                onClick={handleChangePassword}
              >
                {isChanging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
