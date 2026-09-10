import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status value.' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Inquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ inquiry: updated }, { status: 200 });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    return NextResponse.json({ message: 'Failed to update inquiry.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Inquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Inquiry deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    return NextResponse.json({ message: 'Failed to delete inquiry.' }, { status: 500 });
  }
}
