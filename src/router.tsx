import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { toast } from 'sonner';
import type { AppRouter } from '@/api/routers/index';
import SplashScreen from '@/components/layout/splash-screen';
import { NotFound } from '@/components/not-found';
import { authClient } from '@/lib/auth/client';
import { TRPCProvider } from '@/lib/trpc';
import { routeTree } from '@/routeTree.gen';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: 'Retry',
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
  defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

const trpc = createTRPCOptionsProxy({
  client: trpcClient,
  queryClient,
});

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { trpc, queryClient, authClient },
    defaultPendingComponent: () => <SplashScreen />,
    defaultNotFoundComponent: () => <NotFound />,
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
          {children}
        </TRPCProvider>
      </QueryClientProvider>
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
