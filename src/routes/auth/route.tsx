import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { NotFound } from '@/components/not-found';
import { authClient } from '@/lib/auth/client';

const authSearchSchema = z
  .object({
    addAccount: z.boolean().optional().default(false),
  })
  .passthrough();

export const Route = createFileRoute('/auth')({
  validateSearch: authSearchSchema,
  beforeLoad: async ({ search }) => {
    const session = await authClient.getSession();

    // Allow access to auth pages if adding a new account
    if (session.data?.user && !search.addAccount) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: AuthLayout,
  notFoundComponent: () => <NotFound />,
});

function AuthLayout() {
  return <Outlet />;
}
