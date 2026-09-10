import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { getUserFromRequest } from '@/lib/auth';
import { sendBrevoEmail, generateAdminReplyEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { inquiryId, toEmail, clientName, replyMessage, service } = body;

    if (!toEmail || !replyMessage) {
      return NextResponse.json({ message: 'Recipient email and reply message are required.' }, { status: 400 });
    }

    // Generate HTML template
    const htmlContent = generateAdminReplyEmail({
      clientName: clientName || 'Client',
      replyMessage,
      service: service || 'Project Inquiry',
    });

    const subject = `Re: ${service || 'Project Inquiry'} — Tech Team Studio`;

    // Dispatch via Brevo API
    const emailResult = await sendBrevoEmail({
      to: [{ email: toEmail, name: clientName }],
      subject,
      htmlContent,
    });

    // Update database status if inquiryId is provided
    let updatedInquiry = null;
    if (inquiryId) {
      try {
        await connectToDatabase();
        updatedInquiry = await Inquiry.findByIdAndUpdate(
          inquiryId,
          { status: 'replied' },
          { new: true }
        );
      } catch (dbErr) {
        console.error('Failed to update inquiry status in database:', dbErr);
      }
    }

    if (!emailResult.success) {
      return NextResponse.json({
        message: emailResult.error || emailResult.reason || 'Failed to dispatch email via Brevo. Check BREVO_API_KEY in environment.',
        emailResult,
        inquiry: updatedInquiry,
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Email reply sent successfully via Brevo!',
      inquiry: updatedInquiry,
      emailResult,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Reply API Error:', error);
    return NextResponse.json({ message: 'Internal server error sending reply.' }, { status: 500 });
  }
}
