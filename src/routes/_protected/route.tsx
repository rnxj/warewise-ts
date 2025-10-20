import { createFileRoute, Outlet } from '@tanstack/react-router';
import { NotFound } from '@/components/not-found';
import { protectedRouteMiddleware } from '@/core/middleware/auth';

export const Route = createFileRoute('/_protected')({
  server: {
    middleware: [protectedRouteMiddleware],
  },
  component: ProtectedLayout,
  notFoundComponent: () => <NotFound />,
});

function ProtectedLayout() {
  return <Outlet />;
}
