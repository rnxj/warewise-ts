import type { Config } from 'drizzle-kit';

const config: Config = {
  out: './src/lib/db/migrations',
  schema: ['./src/lib/db/auth-schema.ts'],
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
    databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? '',
    token: process.env.CLOUDFLARE_D1_TOKEN ?? '',
  },
  tablesFilter: ['!_cf_KV', '!auth_*'],
};

export default config satisfies Config;
