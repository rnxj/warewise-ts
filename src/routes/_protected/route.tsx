import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Loader from '@/components/layout/loader';
import { RouteBreadcrumb } from '@/components/layout/route-breadcrumb';
import { NotFound } from '@/components/not-found';
import { ModeToggle } from '@/components/theme/mode-toggle';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth/client';
import { getCookie, parseCookieValue } from '@/lib/cookies';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession();

    if (!session.data?.user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: ProtectedLayout,
  notFoundComponent: () => <NotFound />,
  ssr: false,
});

function ProtectedLayout() {
  // Read the sidebar state from cookie
  const sidebarCookie = getCookie('sidebar_state');
  const defaultOpen = parseCookieValue(sidebarCookie);

  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 mr-2" />
            <RouteBreadcrumb />
          </div>
          <div className="px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6 lg:px-8">
              {isFetching ? <Loader /> : <Outlet />}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
