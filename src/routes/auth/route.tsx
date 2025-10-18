import { createFileRoute, Outlet } from '@tanstack/react-router';
import { z } from 'zod';
import { NotFound } from '@/components/not-found';
import { authRouteMiddleware } from '@/core/middleware/auth';

const authSearchSchema = z
  .object({
    addAccount: z.boolean().optional().default(false),
  })
  .passthrough();

export const Route = createFileRoute('/auth')({
  validateSearch: authSearchSchema,
  server: {
    middleware: [authRouteMiddleware],
  },
  component: AuthLayout,
  notFoundComponent: () => <NotFound />,
});

function AuthLayout() {
  return <Outlet />;
}
