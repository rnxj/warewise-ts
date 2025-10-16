import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { GoogleLogin } from '@/components/auth/google-login';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { authClient } from '@/lib/auth/client';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const session = authClient.useSession();

  return (
    <>
      {session.isPending ? (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
        </div>
      ) : session.data ? (
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar className="flex-shrink-0" />

          <div className="flex flex-1 flex-col overflow-hidden">
            <Header
              onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
              <div className="mx-auto max-w-7xl">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      ) : (
        <GoogleLogin />
      )}
    </>
  );
}
