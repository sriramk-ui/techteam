import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Event } from '@/models/Event';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const event = await Event.findById(id).populate('assignedMembers', 'name email role');
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    const data = await req.json();
    await connectToDatabase();
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    await connectToDatabase();
    const event = await Event.findByIdAndDelete(id);
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
