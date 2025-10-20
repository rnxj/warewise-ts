// DO NOT DELETE THIS FILE!!!
// This file is a good smoke test to make sure the custom server entry is working

import handler from '@tanstack/react-start/server-entry';
import { setAuth } from '@/lib/auth/server';
import { initDatabase } from '@/lib/db/setup';

export default {
  fetch(
    request: Request,
    env: {
      DB: D1Database;
      BETTER_AUTH_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      RESEND_API_KEY?: string;
      RESEND_EMAIL?: string;
      APP_URL?: string;
    }
  ) {
    const db = initDatabase(env.DB);

    setAuth({
      secret: env.BETTER_AUTH_SECRET,
      socialProviders: {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      },
      resendApiKey: env.RESEND_API_KEY,
      resendEmail: env.RESEND_EMAIL,
      appUrl: env.APP_URL,
      adapter: {
        drizzleDb: db,
        provider: 'sqlite',
      },
    });
    return handler.fetch(request, {});
  },
};
