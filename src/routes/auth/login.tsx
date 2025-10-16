import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, GalleryVerticalEnd, LogIn, UserPlus } from 'lucide-react';
import { z } from 'zod';
import LoginForm from '@/components/auth/login-form';
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

const loginSearchSchema = z.object({
  addAccount: z.boolean().optional().default(false),
});

export const Route = createFileRoute('/auth/login')({
  validateSearch: loginSearchSchema,
  component: LoginPage,
});

function LoginPage() {
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
                <UserPlus className="mr-1 h-3 w-3" />
                Adding
              </Badge>
            </CardContent>
          </Card>
        )}

        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              {addAccount ? (
                <div className="flex flex-col gap-2">
                  <LogIn className="mx-auto h-8 w-8 text-muted-foreground" />
                  <span>Add Another Account</span>
                </div>
              ) : (
                'Welcome Back'
              )}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm">
              {addAccount ? (
                <p>
                  Sign in with a different account and manage multiple profiles
                </p>
              ) : (
                <p>Enter your email below to login to your account</p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <LoginForm />
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
              Not registered?{' '}
              <Link
                className="font-medium text-primary underline hover:no-underline"
                search={addAccount ? { addAccount: true } : undefined}
                to="/auth/register"
              >
                Create an account
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
