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
