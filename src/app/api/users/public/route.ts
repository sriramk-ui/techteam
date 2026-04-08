import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';

// GET /api/users/public — returns all team members (no auth needed, for public /team page)
export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).select('name role socialLinks -password');
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Public users fetch error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
