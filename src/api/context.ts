import { getAuth } from '@/lib/auth/server';

export async function createContext({ req }: { req: Request }) {
  const session = await getAuth().api.getSession({
    headers: req.headers,
  });
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
