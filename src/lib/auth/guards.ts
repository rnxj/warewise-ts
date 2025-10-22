import { redirect } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { authClient } from './client';
import { getAuth } from './server';

// Type for normalized session data
type SessionData = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    activeOrganizationId?: string | null;
  };
} | null;

// Isomorphic function to get current session
export const getSession = createIsomorphicFn()
  .server(async (): Promise<SessionData> => {
    const auth = getAuth();
    const req = getRequest();
    const session = await auth.api.getSession(req);

    if (!session?.user) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      session: {
        activeOrganizationId: session.session.activeOrganizationId,
      },
    };
  })
  .client(async (): Promise<SessionData> => {
    // On client, use the auth client to get session
    const sessionResult = await authClient.getSession();

    if (!sessionResult.data?.user) {
      return null;
    }

    const session = sessionResult.data;
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      session: {
        activeOrganizationId: session.session.activeOrganizationId,
      },
    };
  });

// Isomorphic function to check if user is authenticated
export const isAuthenticated = createIsomorphicFn()
  .server(async () => {
    const session = await getSession();
    return !!session?.user;
  })
  .client(async () => {
    const session = await getSession();
    return !!session?.user;
  });

// Isomorphic function to get organizations
export const getOrganizations = createIsomorphicFn()
  .server(async () => {
    const auth = getAuth();
    const req = getRequest();
    const result = await auth.api.listOrganizations({ headers: req.headers });
    return Array.isArray(result) ? result : [];
  })
  .client(async () => {
    const result = await authClient.organization.list();
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  });

// Isomorphic function to require authentication - redirects if not authenticated
export const requireAuth = createIsomorphicFn()
  .server(async (redirectTo?: string) => {
    const session = await getSession();
    if (!session?.user) {
      const req = getRequest();
      const url = new URL(req.url);
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: redirectTo || url.pathname + url.search,
        },
      });
    }
    return {
      userId: session.user.id,
      email: session.user.email,
      activeOrganizationId: session.session.activeOrganizationId,
    };
  })
  .client(async (redirectTo?: string) => {
    const session = await getSession();
    if (!session?.user) {
      const currentPath =
        redirectTo || window.location.pathname + window.location.search;
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: currentPath,
        },
      });
    }
    return {
      userId: session.user.id,
      email: session.user.email,
      activeOrganizationId: session.session.activeOrganizationId,
    };
  });

// Isomorphic function to require workspace - checks if user has organizations and active org
export const requireWorkspace = createIsomorphicFn()
  .server(async () => {
    // First ensure user is authenticated
    const authData = await requireAuth();

    const auth = getAuth();
    const req = getRequest();
    const url = new URL(req.url);

    // Skip workspace check for certain routes
    const skipWorkspaceRoutes = ['/workspace/create', '/accept-invitation'];
    if (skipWorkspaceRoutes.some((route) => url.pathname.includes(route))) {
      return authData;
    }

    const organizations = await getOrganizations();

    if (!organizations || organizations.length === 0) {
      throw redirect({
        to: '/workspace/create',
      });
    }

    // Check if user has an active organization
    if (!authData.activeOrganizationId) {
      // User has organizations but none is active, set the first one as active
      const firstOrg = organizations[0];
      await auth.api.setActiveOrganization({
        body: { organizationId: firstOrg.id },
        headers: req.headers,
      });

      // Redirect to same page to refresh with active organization
      throw redirect({
        to: url.pathname + url.search,
      });
    }

    return authData;
  })
  .client(async () => {
    // First ensure user is authenticated
    const authData = await requireAuth();

    // Skip workspace check for certain routes
    const skipWorkspaceRoutes = ['/workspace/create', '/accept-invitation'];
    if (
      skipWorkspaceRoutes.some((route) =>
        window.location.pathname.includes(route)
      )
    ) {
      return authData;
    }

    const organizations = await getOrganizations();

    if (!organizations || organizations.length === 0) {
      throw redirect({
        to: '/workspace/create',
      });
    }

    // Check if user has an active organization
    if (!authData.activeOrganizationId) {
      // User has organizations but none is active, set the first one as active
      const firstOrg = organizations[0];
      await authClient.organization.setActive({
        organizationId: firstOrg.id,
      });

      // Redirect to same page to refresh with active organization
      throw redirect({
        to: window.location.pathname + window.location.search,
      });
    }

    return authData;
  });

// Isomorphic function to redirect authenticated users away from auth pages
export const redirectIfAuthenticated = createIsomorphicFn()
  .server(async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({
        to: '/dashboard',
      });
    }
    return { session };
  })
  .client(async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({
        to: '/dashboard',
      });
    }
    return { session };
  });
