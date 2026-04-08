import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await connectToDatabase();
    const users = await User.find({}).select('-password');
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Admin can create a new user (team member)
export async function POST(req: NextRequest) {
  try {
    const requester = getUserFromRequest(req);
    if (!requester || requester.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    const data = await req.json();
    await connectToDatabase();
    const existing = await User.findOne({ email: data.email });
    if (existing) return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newUser = await User.create({ ...data, password: hashedPassword });
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
