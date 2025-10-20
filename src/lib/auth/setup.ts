import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { sendInvitationEmail } from '../emails/invitation';
import { ac, biller, inventoryManager, owner } from './permissions';

export const createBetterAuth = (config: {
  database: BetterAuthOptions['database'];
  secret?: BetterAuthOptions['secret'];
  socialProviders?: BetterAuthOptions['socialProviders'];
  resendApiKey?: string;
  resendEmail?: string;
  appUrl?: string;
}) => {
  return betterAuth({
    database: config.database,
    secret: config.secret,
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: config.socialProviders,
    user: {
      modelName: 'auth_user',
    },
    session: {
      modelName: 'auth_session',
    },
    verification: {
      modelName: 'auth_verification',
    },
    account: {
      modelName: 'auth_account',
      accountLinking: {
        enabled: true,
        trustedProviders: ['google'],
      },
    },
    plugins: [
      organization({
        ac,
        roles: {
          owner,
          biller,
          inventoryManager,
        },
        allowUserToCreateOrganization: true,
        organizationLimit: 5,
        membershipLimit: 100,
        invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
        sendInvitationEmail: (data) =>
          sendInvitationEmail(data, {
            resendApiKey: config.resendApiKey,
            resendEmail: config.resendEmail,
            appUrl: config.appUrl,
          }),
      }),
    ],
  });
};
