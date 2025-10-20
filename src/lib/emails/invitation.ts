import { Resend } from 'resend';

export interface InvitationEmailData {
  email: string;
  organization: {
    name: string;
  };
  inviter: {
    user: {
      name: string;
    };
  };
  invitation: {
    id: string;
  };
}

export interface EmailConfig {
  resendApiKey?: string;
  resendEmail?: string;
  appUrl?: string;
}

export const sendInvitationEmail = async (
  data: InvitationEmailData,
  config: EmailConfig
) => {
  if (!config.appUrl) {
    throw new Error('APP_URL is required to send invitation emails');
  }

  if (!(config.resendApiKey && config.resendEmail)) {
    // biome-ignore lint/suspicious/noConsole: debug
    console.log('Invitation sent (mock):', {
      email: data.email,
      organizationName: data.organization.name,
      inviterName: data.inviter.user.name,
    });
    return;
  }

  try {
    const resend = new Resend(config.resendApiKey);

    await resend.emails.send({
      from: config.resendEmail,
      to: data.email,
      subject: `Invitation to join ${data.organization.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
          <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 24px 0; color: #0f172a;">You've been invited to join ${data.organization.name}</h2>
          <p style="margin: 0 0 16px 0; line-height: 1.6; color: #475569;">Hi there!</p>
          <p style="margin: 0 0 24px 0; line-height: 1.6; color: #475569;">${data.inviter.user.name} has invited you to join <strong style="color: #0f172a;">${data.organization.name}</strong> on WareWise.</p>
          <p style="margin: 0 0 24px 0; line-height: 1.6; color: #475569;">Click the button below to accept the invitation:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${config.appUrl}/accept-invitation/${data.invitation.id}" 
               style="display: inline-block; text-align: center; vertical-align: middle; line-height: 40px; white-space: nowrap; border-radius: 6px; font-weight: 500; font-size: 14px; outline: none; transition: all 0.2s; text-decoration: none; background-color: #0f172a; color: white; height: 40px; padding: 0 24px; border: none; cursor: pointer;"
               onmouseover="this.style.backgroundColor='#1e293b'"
               onmouseout="this.style.backgroundColor='#0f172a'">Accept Invitation</a>
          </div>
          <p style="margin: 24px 0 0 0; line-height: 1.6; color: #475569;">If you have any questions, please contact ${data.inviter.user.name} directly.</p>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">This invitation will expire in 7 days.</p>
        </div>
      `,
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: debug
    console.error('Failed to send invitation email:', error);
    throw error;
  }
};
