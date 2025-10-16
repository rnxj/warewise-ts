import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  GalleryVerticalEnd,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { z } from 'zod';
import RegisterForm from '@/components/auth/register-form';
import { Google } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

const registerSearchSchema = z.object({
  addAccount: z.boolean().optional().default(false),
});

export const Route = createFileRoute('/auth/register')({
  validateSearch: registerSearchSchema,
  component: RegisterPage,
});

function RegisterPage() {
  const { addAccount } = Route.useSearch();
  const { data: session } = authClient.useSession();

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <a className="flex items-center gap-2 self-center font-medium" href="/">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {siteConfig.name}
        </a>

        {addAccount && session?.user && (
          <Card className="w-full border-muted bg-muted/30">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    alt={session.user.name}
                    src={session.user.image || undefined}
                  />
                  <AvatarFallback className="text-xs">
                    {getUserInitials(session.user.name, session.user.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {session.user.name || 'Current Account'}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <Badge className="text-xs" variant="success">
                <UserCheck className="mr-1 h-3 w-3" />
                Active
              </Badge>
            </CardContent>
          </Card>
        )}

        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              {addAccount ? (
                <div className="flex flex-col gap-2">
                  <UserPlus className="mx-auto h-8 w-8 text-muted-foreground" />
                  <span>Create New Account</span>
                </div>
              ) : (
                'Create your account'
              )}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm">
              {addAccount ? (
                <p>
                  Register a new account while keeping your current session
                  active
                </p>
              ) : (
                <p>Create a new account to manage your business</p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <RegisterForm />
            <div className="my-2 flex items-center">
              <div className="h-px flex-1 bg-muted-foreground/30" />
              <span className="mx-3 font-medium text-muted-foreground text-xs">
                OR
              </span>
              <div className="h-px flex-1 bg-muted-foreground/30" />
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: 'google',
                  callbackURL: '/dashboard',
                });
              }}
              type="button"
              variant="outline"
            >
              <Google className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link
                className="font-medium text-primary underline hover:no-underline"
                search={addAccount ? { addAccount: true } : undefined}
                to="/auth/login"
              >
                Sign in
              </Link>
            </div>
            {addAccount && (
              <Link to="/dashboard">
                <Button className="w-full" variant="ghost">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel & Go Back
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
