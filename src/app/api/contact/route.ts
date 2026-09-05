import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, service, budget, message } = body;

    if (!name || !email || !service) {
      return NextResponse.json({ message: 'Name, email, and service selection are required.' }, { status: 400 });
    }

    console.log('[CLIENT INQUIRY RECEIVED]:', {
      name,
      email,
      service,
      budget,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Inquiry received successfully! Our team will contact you within 24 hours.',
      inquiry: { name, email, service, budget },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ message: 'Failed to submit inquiry. Please try again.' }, { status: 500 });
  }
}
