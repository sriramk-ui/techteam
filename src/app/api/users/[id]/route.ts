import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const user = await User.findById(id).select('-password');
    if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const requester = getUserFromRequest(req);
    if (!requester) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    
    // Users can only edit themselves; Admin can edit anyone
    if (requester.id !== id && requester.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const data = await req.json();
    
    // Protection: Only admins can change roles
    if (data.role && requester.role !== 'ADMIN') {
      delete data.role;
    }
    
    // Protection: Password changes should happen through the dedicated endpoint
    delete data.password;

    await connectToDatabase();
    const updated = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const requester = getUserFromRequest(req);
    if (!requester || requester.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    await connectToDatabase();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
