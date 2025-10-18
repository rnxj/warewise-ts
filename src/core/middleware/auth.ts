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
      const url = new URL(request.url);
      const searchParams = new URLSearchParams(url.search);
      const addAccount = searchParams.get('addAccount') === 'true';

      // Allow access to auth pages if adding a new account
      if (!addAccount) {
        throw redirect({
          to: '/dashboard',
        });
      }
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
