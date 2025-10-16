import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import Database from 'better-sqlite3';
import { createBetterAuth } from './setup';

// For CLI use - uses dummy SQLite database
export const auth = createBetterAuth({
  database: drizzleAdapter(new Database('./src/lib/auth/test.sqlite'), {
    provider: 'sqlite',
  }),
});
