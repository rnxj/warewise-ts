import { createFileRoute, Outlet } from '@tanstack/react-router';
import { NotFound } from '@/components/not-found';
import { requireAuth } from '@/lib/auth/guards';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const authData = await requireAuth();
    return { authData };
  },
  component: ProtectedLayout,
  notFoundComponent: () => <NotFound />,
});

function ProtectedLayout() {
  return <Outlet />;
}
