import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/_sidebar/dashboard')({
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
  const { authClient, trpc } = Route.useRouteContext();
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const { data: privateData, isLoading } = useQuery(
    trpc.privateData.queryOptions()
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Compact Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl md:text-2xl">Dashboard</h1>
          <p className="text-muted-foreground text-xs">
            Welcome back, {session?.user.name} •{' '}
            {activeOrg ? activeOrg.name : 'Loading workspace...'}
          </p>
        </div>
      </div>

      {/* Organization Info */}
      {activeOrg && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-2 font-semibold text-lg">Workspace Information</h2>
          <div className="flex items-center gap-4">
            {activeOrg.logo && (
              <img
                alt={activeOrg.name}
                className="h-12 w-12 rounded-lg object-cover"
                height={64}
                src={activeOrg.logo}
                width={64}
              />
            )}
            <div>
              <p className="font-medium">{activeOrg.name}</p>
              <p className="text-muted-foreground text-sm">/{activeOrg.slug}</p>
            </div>
          </div>
        </div>
      )}

      {/* tRPC Private Data */}
      <div className="mt-6 rounded-lg border p-4">
        <h2 className="mb-2 font-semibold text-lg">Private Data from tRPC</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p className="text-muted-foreground text-sm">
              {privateData?.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
