import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { sendBrevoEmail, generateClientConfirmationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, service, budget, message } = body;

    if (!name || !email || !service) {
      return NextResponse.json({ message: 'Name, email, and service selection are required.' }, { status: 400 });
    }

    let newInquiry = null;
    try {
      await connectToDatabase();
      newInquiry = await Inquiry.create({
        name,
        email: email.trim().toLowerCase(),
        service,
        budget: budget || '',
        message: message || '',
        status: 'new',
      });
      console.log('[CLIENT INQUIRY CREATED]:', newInquiry._id);
    } catch (dbError) {
      console.error('[CLIENT INQUIRY DB SAVE ERROR]:', dbError);
    }

    // Trigger professional auto-reply email to client via Brevo
    try {
      const htmlContent = generateClientConfirmationEmail({ name, service, message });
      sendBrevoEmail({
        to: [{ email: email.trim().toLowerCase(), name }],
        subject: `Inquiry Received — Tech Team Studio`,
        htmlContent,
      }).catch((emailErr) => console.error('[AUTO-REPLY BREVO ERROR]:', emailErr));
    } catch (emailErr) {
      console.error('[AUTO-REPLY TEMPLATE ERROR]:', emailErr);
    }

    return NextResponse.json({
      message: 'Inquiry received successfully! Our team will contact you within 24 hours.',
      inquiry: newInquiry || { name, email, service, budget, message },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ message: 'Failed to submit inquiry. Please try again.' }, { status: 500 });
  }
}
