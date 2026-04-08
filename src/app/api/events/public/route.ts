import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Event } from '@/models/Event';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Find all public events
    const events = await Event.find({ visibility: 'public' })
      .populate('assignedMembers', 'name role socialLinks')
      .sort({ date: -1 });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Fetch public events error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
