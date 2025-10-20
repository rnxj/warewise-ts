import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { getAuth } from '@/lib/auth/server';

async function getAuthContext() {
  const auth = getAuth();
  const req = getRequest();

  const session = await auth.api.getSession(req);
  if (!session) {
    throw new Error('Unauthorized');
  }

  return {
    auth,
    userId: session.user.id,
    email: session.user.email,
  };
}

export const protectedFunctionMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  const context = await getAuthContext();
  return next({ context });
});

export const protectedRequestMiddleware = createMiddleware({
  type: 'request',
}).server(async ({ next }) => {
  const context = await getAuthContext();
  return next({ context });
});

// Middleware for protected routes - redirects unauthenticated users to login
export const protectedRouteMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const auth = getAuth();
    const session = await auth.api.getSession(request);

    if (!session?.user) {
      const url = new URL(request.url);
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: url.pathname + url.search,
        },
      });
    }

    return next({
      context: {
        auth,
        userId: session.user.id,
        email: session.user.email,
        activeOrganizationId: session.session.activeOrganizationId,
      },
    });
  }
);

// Middleware for routes that require a workspace - redirects to workspace creation
export const workspaceRequiredMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const auth = getAuth();
    const session = await auth.api.getSession(request);

    if (!session?.user) {
      const url = new URL(request.url);
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: url.pathname + url.search,
        },
      });
    }

    // Skip workspace check for certain routes
    const url = new URL(request.url);
    const skipWorkspaceRoutes = ['/workspace/create', '/accept-invitation'];

    if (skipWorkspaceRoutes.some((route) => url.pathname.includes(route))) {
      return next({
        context: {
          auth,
          userId: session.user.id,
          email: session.user.email,
          activeOrganizationId: session.session.activeOrganizationId,
        },
      });
    }

    const organizations = await auth.api.listOrganizations({
      headers: request.headers,
    });

    if (!organizations || organizations.length === 0) {
      throw redirect({
        to: '/workspace/create',
      });
    }

    // Check if user has an active organization
    if (!session.session.activeOrganizationId) {
      // User has organizations but none is active, set the first one as active
      const firstOrg = organizations[0];
      await auth.api.setActiveOrganization({
        body: { organizationId: firstOrg.id },
        headers: request.headers,
      });

      // Redirect to same page to refresh with active organization
      throw redirect({
        to: url.pathname + url.search,
      });
    }

    return next({
      context: {
        auth,
        userId: session.user.id,
        email: session.user.email,
        activeOrganizationId: session.session.activeOrganizationId,
      },
    });
  }
);

// Middleware for auth routes - redirects authenticated users to dashboard
export const authRouteMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const auth = getAuth();
    const session = await auth.api.getSession(request);

    if (session?.user) {
      throw redirect({
        to: '/dashboard',
      });
    }

    return next({
      context: {
        auth,
        session,
        userId: session?.user?.id,
        email: session?.user?.email,
      },
    });
  }
);
