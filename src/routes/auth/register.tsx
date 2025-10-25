import { createFileRoute, Link } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';
import RegisterForm from '@/components/auth/register-form';
import { Google } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { authClient } from '@/lib/auth/client';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
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
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              Create your account
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm">
              <p>Create a new account to manage your business</p>
            </CardDescription>
          </CardHeader>
          <CardPanel className="flex flex-col gap-4">
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
                to="/auth/login"
              >
                Sign in
              </Link>
            </div>
          </CardPanel>
        </Card>
      </div>
    </div>
  );
}
