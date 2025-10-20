import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { ac, biller, inventoryManager, owner } from './permissions';

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        biller,
        inventoryManager,
      },
    }),
  ],
});
