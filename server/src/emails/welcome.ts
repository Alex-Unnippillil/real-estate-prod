export interface WelcomeTemplate {
  firstName: string;
  loginUrl: string;
}

/**
 * Generates the welcome email subject and HTML body.
 */
export function welcomeTemplate({
  firstName,
  loginUrl,
}: WelcomeTemplate): { subject: string; html: string } {
  return {
    subject: `Welcome, ${firstName}!`,
    html: `<p>Hello ${firstName},</p><p>Welcome to our platform. <a href="${loginUrl}">Login</a> to get started.</p>`,
  };
}

