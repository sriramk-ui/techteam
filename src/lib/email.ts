/**
 * Brevo (Sendinblue) Email Utility & Professional HTML Templates
 */

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  senderName?: string;
  senderEmail?: string;
  replyTo?: EmailRecipient;
}

/**
 * Sends an email via Brevo REST API v3
 */
export async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
  senderName = process.env.BREVO_SENDER_NAME || 'Tech Team Studio',
  senderEmail = process.env.BREVO_SENDER_EMAIL || 'techteam@studio.dev',
  replyTo,
}: SendEmailOptions) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn('[BREVO EMAIL] BREVO_API_KEY is not configured in environment. Email sending skipped.');
    return { success: false, reason: 'BREVO_API_KEY is missing' };
  }

  try {
    const payload: Record<string, any> = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to,
      subject,
      htmlContent,
    };

    if (replyTo) {
      payload.replyTo = replyTo;
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[BREVO API ERROR]:', data);
      return { success: false, error: data.message || 'Failed to send email via Brevo' };
    }

    console.log('[BREVO EMAIL SENT SUCCESSFULLY]:', data.messageId || data);
    return { success: true, data };
  } catch (err: any) {
    console.error('[BREVO FETCH EXCEPTION]:', err);
    return { success: false, error: err.message || 'Network error sending email via Brevo' };
  }
}

/**
 * Professional HTML Email Template for Client Inquiry Confirmation
 */
export function generateClientConfirmationEmail({
  name,
  service,
  message,
}: {
  name: string;
  service: string;
  message?: string;
}): string {
  const safeMessage = message ? message.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Received — Tech Team Studio</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07060E; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #07060E; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0F0D1B; border: 1px solid #232035; border-radius: 4px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #EC170F 0%, #0B3B9B 100%);"></td>
          </tr>

          <!-- Header Logo -->
          <tr>
            <td style="padding: 32px 40px 20px; background-color: #0F0D1B; border-bottom: 1px solid #1E1B2E;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="font-weight: 900; font-size: 20px; letter-spacing: 2px; color: #FFFFFF;">
                      TECH<span style="color: #EC170F;">.</span>TEAM
                    </span>
                    <span style="font-size: 11px; font-family: monospace; color: #71717A; letter-spacing: 1px; margin-left: 8px;">STUDIO</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; font-family: monospace; font-weight: 700; color: #EC170F; background-color: rgba(236,23,15,0.12); padding: 4px 10px; border: 1px solid rgba(236,23,15,0.3); border-radius: 2px;">
                      CONFIRMATION
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 40px;">
              <h1 style="margin: 0 0 16px; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                INQUIRY <span style="color: #EC170F;">RECEIVED.</span>
              </h1>
              
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #A1A1AA;">
                Hello <strong style="color: #FFFFFF;">${name}</strong>,
              </p>

              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.7; color: #A1A1AA;">
                Thank you for reaching out to Tech Team Studio. We have received your project inquiry regarding <strong style="color: #FFFFFF;">${service}</strong>. Our engineering collective is reviewing your specifications and will respond within <strong style="color: #FFFFFF;">24 hours</strong>.
              </p>

              <!-- Submission Summary Box -->
              <table role="presentation" width="100%" style="background-color: #161328; border-left: 3px solid #EC170F; padding: 20px; margin-bottom: 28px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #EC170F; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                      SELECTED SERVICE
                    </div>
                    <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px;">
                      ${service}
                    </div>
                    ${safeMessage ? `
                    <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #71717A; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      PROJECT SPECIFICATIONS
                    </div>
                    <div style="font-size: 13px; color: #D4D4D8; line-height: 1.6; font-style: italic;">
                      &ldquo;${safeMessage}&rdquo;
                    </div>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 28px; font-size: 14px; line-height: 1.6; color: #71717A;">
                If you have additional technical documents or timeline constraints, feel free to reply directly to this email.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #EC170F; border-radius: 2px;">
                    <a href="https://innovation-collaboration.vercel.app/projects" target="_blank" style="font-size: 12px; font-family: monospace; font-weight: 700; color: #FFFFFF; text-decoration: none; display: inline-block; padding: 14px 28px; letter-spacing: 1px; text-transform: uppercase;">
                      EXPLORE OUR PORTFOLIO &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #0B0914; border-top: 1px solid #1B182B; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #71717A; font-family: monospace;">
                TECH TEAM STUDIO &middot; ENGINEERING COLLECTIVE
              </p>
              <p style="margin: 0; font-size: 11px; color: #52525B;">
                Building High-Performance Web Apps, AI Systems & Digital Products.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Professional HTML Email Template for Admin Responses to Clients
 */
export function generateAdminReplyEmail({
  clientName,
  replyMessage,
  service,
}: {
  clientName: string;
  replyMessage: string;
  service: string;
}): string {
  const formattedReply = replyMessage
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Response from Tech Team Studio</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07060E; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #07060E; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0F0D1B; border: 1px solid #232035; border-radius: 4px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #EC170F 0%, #0B3B9B 100%);"></td>
          </tr>

          <!-- Header Logo -->
          <tr>
            <td style="padding: 32px 40px 20px; background-color: #0F0D1B; border-bottom: 1px solid #1E1B2E;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="font-weight: 900; font-size: 20px; letter-spacing: 2px; color: #FFFFFF;">
                      TECH<span style="color: #EC170F;">.</span>TEAM
                    </span>
                    <span style="font-size: 11px; font-family: monospace; color: #71717A; letter-spacing: 1px; margin-left: 8px;">STUDIO</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; font-family: monospace; font-weight: 700; color: #10B981; background-color: rgba(16,185,129,0.12); padding: 4px 10px; border: 1px solid rgba(16,185,129,0.3); border-radius: 2px;">
                      OFFICIAL RESPONSE
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 40px;">
              <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #EC170F; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                RE: ${service.toUpperCase()}
              </div>

              <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                PROJECT <span style="color: #EC170F;">RESPONSE.</span>
              </h1>
              
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #A1A1AA;">
                Hello <strong style="color: #FFFFFF;">${clientName}</strong>,
              </p>

              <!-- Admin Reply Text Box -->
              <div style="background-color: #161328; border-left: 3px solid #EC170F; padding: 24px; margin-bottom: 28px; font-size: 15px; line-height: 1.7; color: #E2E8F0;">
                ${formattedReply}
              </div>

              <p style="margin: 0 0 28px; font-size: 14px; line-height: 1.6; color: #71717A;">
                You can reply directly to this email to continue our technical discussion.
              </p>

              <!-- Signature Block -->
              <table role="presentation" width="100%" style="border-top: 1px solid #1E1B2E; padding-top: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 700; color: #FFFFFF;">
                      Tech Team Studio Engineering
                    </div>
                    <div style="font-size: 12px; color: #71717A; font-family: monospace; margin-top: 4px;">
                      techteam@studio.dev &middot; https://innovation-collaboration.vercel.app
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #0B0914; border-top: 1px solid #1B182B; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #71717A; font-family: monospace;">
                TECH TEAM STUDIO &middot; OFFICIAL COMMUNICATIONS
              </p>
              <p style="margin: 0; font-size: 11px; color: #52525B;">
                All rights reserved &copy; ${new Date().getFullYear()} Tech Team Studio.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
