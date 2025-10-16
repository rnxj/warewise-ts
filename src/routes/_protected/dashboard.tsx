import { createFileRoute } from '@tanstack/react-router';
import { authClient } from '@/lib/auth/client';

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Dashboard',
      },
    ],
  }),
});

function RouteComponent() {
  const { data: session } = authClient.useSession();

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Compact Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl md:text-2xl">Dashboard</h1>
          <p className="text-muted-foreground text-xs">
            Welcome back, {session?.user.name}
          </p>
        </div>
      </div>
    </div>
  );
}
