import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json({ message: 'Failed to fetch contact inquiries.' }, { status: 500 });
  }
}
