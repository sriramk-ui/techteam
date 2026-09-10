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

export interface ProjectUpdateEmailParams {
  clientName: string;
  projectName?: string;
  service?: string;
  updateTitle?: string;
  replyMessage: string;
  status?: string;
  projectId?: string;
  lastUpdated?: string;
  latestMilestone?: string;
  senderName?: string;
  senderDesignation?: string;
  companyName?: string;
  companyEmail?: string;
  websiteUrl?: string;
  portalUrl?: string;
}

/**
 * HTML Email Template for Project Update Email / Admin Inquiry Replies
 */
export function generateProjectUpdateEmail({
  clientName,
  projectName,
  service,
  updateTitle,
  replyMessage,
  status = 'In Progress',
  projectId = '#PRJ-2048',
  lastUpdated,
  latestMilestone = 'UI & Feature Updates',
  senderName = 'Tech Team Studio',
  senderDesignation = 'Engineering Lead',
  companyName = 'TECH TEAM STUDIO',
  companyEmail = 'hello@techteam.studio',
  websiteUrl = 'https://innovation-collaboration.vercel.app',
  portalUrl = 'https://innovation-collaboration.vercel.app/projects',
}: ProjectUpdateEmailParams): string {
  const displayProjectName = projectName || service || 'Custom Project';
  const displayUpdateTitle = updateTitle || `Update regarding ${displayProjectName}`;
  const currentDateStr = lastUpdated || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const currentYear = new Date().getFullYear();

  const formattedReply = replyMessage
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Update Email</title>
  <style>
    /* --------------------------------
       RESET
    -------------------------------- */
    body {
      margin: 0;
      padding: 0;
      background: #f3f5f8;
      font-family: Arial, Helvetica, sans-serif;
      color: #172033;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
    }
    img {
      border: 0;
      display: block;
      max-width: 100%;
    }
    a {
      text-decoration: none;
    }
    /* --------------------------------
       MOBILE
    -------------------------------- */
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px !important;
      }
      .container {
        width: 100% !important;
        border-radius: 12px !important;
      }
      .content {
        padding: 25px 20px !important;
      }
      .hero {
        padding: 35px 20px 25px !important;
      }
      .hero-title {
        font-size: 27px !important;
      }
      .footer {
        padding: 25px 20px !important;
      }
      .info-column {
        display: block !important;
        width: 100% !important;
        padding-bottom: 10px !important;
      }
    }
  </style>
</head>
<body>
  <!-- =====================================
       OUTER WRAPPER
  ====================================== -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f5f8;">
    <tr>
      <td align="center" class="email-wrapper" style="padding:45px 15px;">
        <!-- =====================================
             MAIN CONTAINER
        ====================================== -->
        <table width="620" cellpadding="0" cellspacing="0" border="0" class="container" style="width:620px; max-width:620px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 8px 35px rgba(15,23,42,0.08);">
          <!-- =====================================
               HEADER
          ====================================== -->
          <tr>
            <td style="padding:25px 35px; border-bottom:1px solid #edf0f4;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- COMPANY -->
                  <td>
                    <div style="font-size:21px; font-weight:700; color:#111827; letter-spacing:-0.5px;">
                      ${companyName}
                    </div>
                    <div style="margin-top:5px; font-size:10px; color:#98a2b3; letter-spacing:1.5px;">
                      BUSINESS SOLUTIONS
                    </div>
                  </td>
                  <!-- EMAIL -->
                  <td align="right">
                    <a href="mailto:${companyEmail}" style="font-size:12px; color:#667085;">
                      ${companyEmail}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- =====================================
               HERO
          ====================================== -->
          <tr>
            <td class="hero" style="padding:45px 35px 30px; background:#fafbfc;">
              <!-- UPDATE BADGE -->
              <div style="display:inline-block; padding:7px 12px; background:#eaf2ff; color:#2563eb; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:0.8px;">
                PROJECT UPDATE
              </div>
              <!-- GREETING -->
              <h1 class="hero-title" style="margin:20px 0 10px; font-size:32px; line-height:1.2; letter-spacing:-1px; color:#111827;">
                Hello, ${clientName}
              </h1>
              <p style="margin:0; font-size:15px; line-height:1.7; color:#667085;">
                There's a new update available for your project.
              </p>
            </td>
          </tr>

          <!-- =====================================
               MAIN CONTENT
          ====================================== -->
          <tr>
            <td class="content" style="padding:35px;">
              <!-- PROJECT NAME -->
              <h2 style="margin:0 0 10px; font-size:22px; line-height:1.3; color:#111827;">
                ${displayProjectName}
              </h2>
              <p style="margin:0; font-size:14px; line-height:1.8; color:#667085;">
                We've added a new update to your project. You can view the latest progress, milestones, activities and project information through your project portal.
              </p>

              <!-- =====================================
                   PROJECT INFORMATION
              ====================================== -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <!-- STATUS -->
                  <td class="info-column" width="48%" style="width:48%; background:#f8fafc; border:1px solid #e9edf3; border-radius:12px; padding:20px;">
                    <div style="font-size:10px; color:#98a2b3; text-transform:uppercase; letter-spacing:1px;">
                      Current Status
                    </div>
                    <div style="margin-top:8px; font-size:15px; font-weight:700; color:#16a34a;">
                      ● ${status}
                    </div>
                  </td>
                  <!-- SPACE -->
                  <td width="4%" style="width:4%;"></td>
                  <!-- PROJECT ID -->
                  <td class="info-column" width="48%" style="width:48%; background:#f8fafc; border:1px solid #e9edf3; border-radius:12px; padding:20px;">
                    <div style="font-size:10px; color:#98a2b3; text-transform:uppercase; letter-spacing:1px;">
                      Project ID
                    </div>
                    <div style="margin-top:8px; font-size:15px; font-weight:700; color:#111827;">
                      ${projectId}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" height="12"></td>
                </tr>
                <tr>
                  <!-- LAST UPDATE -->
                  <td class="info-column" width="48%" style="width:48%; background:#f8fafc; border:1px solid #e9edf3; border-radius:12px; padding:20px;">
                    <div style="font-size:10px; color:#98a2b3; text-transform:uppercase; letter-spacing:1px;">
                      Last Updated
                    </div>
                    <div style="margin-top:8px; font-size:15px; font-weight:700; color:#111827;">
                      ${currentDateStr}
                    </div>
                  </td>
                  <td width="4%"></td>
                  <!-- MILESTONE -->
                  <td class="info-column" width="48%" style="width:48%; background:#f8fafc; border:1px solid #e9edf3; border-radius:12px; padding:20px;">
                    <div style="font-size:10px; color:#98a2b3; text-transform:uppercase; letter-spacing:1px;">
                      Latest Milestone
                    </div>
                    <div style="margin-top:8px; font-size:15px; font-weight:700; color:#111827;">
                      ${latestMilestone}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- =====================================
                   UPDATE CARD
              ====================================== -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px; background:#f8fafc; border:1px solid #e9edf3; border-radius:14px;">
                <tr>
                  <td style="padding:24px;">
                    <div style="font-size:10px; font-weight:700; color:#2563eb; text-transform:uppercase; letter-spacing:1px;">
                      Latest Update
                    </div>
                    <h3 style="margin:10px 0 8px; font-size:17px; color:#111827;">
                      ${displayUpdateTitle}
                    </h3>
                    <div style="margin:0; font-size:13px; line-height:1.8; color:#667085;">
                      ${formattedReply}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- =====================================
                   CTA
              ====================================== -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
                <tr>
                  <td align="center">
                    <a href="${portalUrl}" style="display:inline-block; padding:15px 28px; background:#111827; color:#ffffff; border-radius:9px; font-size:14px; font-weight:700; text-decoration:none;">
                      View Project Updates &rarr;
                    </a>
                    <p style="margin:13px 0 0; font-size:11px; color:#98a2b3;">
                      View your complete project timeline and details
                    </p>
                  </td>
                </tr>
              </table>

              <!-- =====================================
                   DIVIDER
              ====================================== -->
              <div style="height:1px; background:#edf0f4; margin:35px 0;"></div>

              <!-- =====================================
                   CLOSING
              ====================================== -->
              <p style="margin:0; font-size:14px; line-height:1.8; color:#667085;">
                If you have any questions regarding this update, please feel free to contact our team.
              </p>
              <p style="margin:25px 0 0; font-size:14px; line-height:1.7; color:#667085;">
                Best regards,<br>
                <strong style="color:#111827;">
                  ${senderName}
                </strong>
                <br>
                <span style="font-size:12px;">
                  ${senderDesignation} &middot; ${companyName}
                </span>
              </p>
            </td>
          </tr>

          <!-- =====================================
               FOOTER
          ====================================== -->
          <tr>
            <td class="footer" style="background:#111827; padding:30px 35px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- COMPANY -->
                  <td>
                    <div style="color:#ffffff; font-size:16px; font-weight:700;">
                      ${companyName}
                    </div>
                    <div style="margin-top:6px; color:#98a2b3; font-size:11px;">
                      Building better solutions together.
                    </div>
                  </td>
                  <!-- WEBSITE -->
                  <td align="right">
                    <a href="${websiteUrl}" style="color:#ffffff; font-size:12px; text-decoration:none;">
                      Visit Website &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- FOOTER DIVIDER -->
              <div style="height:1px; background:#293241; margin:22px 0;"></div>

              <!-- CONTACT -->
              <div style="color:#98a2b3; font-size:11px; line-height:1.8;">
                ${companyEmail}<br>
                Chennai, Tamil Nadu, India
              </div>

              <!-- LINKS -->
              <div style="margin-top:18px;">
                <a href="${websiteUrl}" style="color:#98a2b3; font-size:11px;">
                  Website
                </a>
                <span style="color:#475467; margin:0 8px;">&middot;</span>
                <a href="#" style="color:#98a2b3; font-size:11px;">
                  Privacy Policy
                </a>
                <span style="color:#475467; margin:0 8px;">&middot;</span>
                <a href="#" style="color:#98a2b3; font-size:11px;">
                  Unsubscribe
                </a>
              </div>

              <!-- COPYRIGHT -->
              <div style="margin-top:20px; color:#667085; font-size:10px;">
                &copy; ${currentYear} ${companyName}. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
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
  return generateProjectUpdateEmail({
    clientName,
    service,
    replyMessage,
    updateTitle: `Official Response regarding ${service || 'Project Inquiry'}`,
    status: 'In Progress',
    latestMilestone: 'Inquiry & Requirements Review',
  });
}
