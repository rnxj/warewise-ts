import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { ChangePassword } from '@/components/auth/profile/change-password';
import { DeleteAccount } from '@/components/auth/profile/delete-account';
import { SessionManager } from '@/components/auth/profile/session-manager';
import { UpdateUserInfo } from '@/components/auth/profile/update-user-info';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { authClient } from '@/lib/auth/client';

export const Route = createFileRoute('/_protected/_sidebar/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: session, isPending: isLoading } = authClient.useSession();

  const user = session?.user;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 text-center">
        <p>Unable to load user information</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-bold text-2xl">Profile</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Manage your profile settings
          </p>
        </div>

        {/* Profile Section */}
        <UpdateUserInfo
          initialEmail={user.email}
          initialImage={user.image}
          initialName={user.name || ''}
        />

        {/* Active Sessions */}
        <SessionManager />

        {/* Change Password */}
        <ChangePassword />

        {/* Sign Out Button */}
        <div className="border-t pt-4">
          <SignOutButton className="w-full" />
        </div>

        {/* Delete Account */}
        <DeleteAccount />
      </div>
    </div>
  );
}
