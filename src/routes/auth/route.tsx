import { createFileRoute, Outlet } from '@tanstack/react-router';
import { NotFound } from '@/components/not-found';
import { redirectIfAuthenticated } from '@/lib/auth/guards';

export const Route = createFileRoute('/auth')({
  beforeLoad: async () => {
    const data = await redirectIfAuthenticated();
    return data;
  },
  component: AuthLayout,
  notFoundComponent: () => <NotFound />,
});

function AuthLayout() {
  return <Outlet />;
}
