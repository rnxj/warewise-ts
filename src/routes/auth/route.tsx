import { createFileRoute, Outlet } from '@tanstack/react-router';
import { NotFound } from '@/components/not-found';
import { authRouteMiddleware } from '@/core/middleware/auth';

export const Route = createFileRoute('/auth')({
  server: {
    middleware: [authRouteMiddleware],
  },
  component: AuthLayout,
  notFoundComponent: () => <NotFound />,
});

function AuthLayout() {
  return <Outlet />;
}
