import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

const BYPASS_EMAIL = (process.env.EMERGENCY_EMAIL || 'techteam@gmail.com').toLowerCase();

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromRequest(req);

    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // ─── Emergency bypass token ───
    if (decoded.id === 'bypass-admin-001') {
      return NextResponse.json({
        user: {
          id: 'bypass-admin-001',
          name: 'Tech Team',
          email: BYPASS_EMAIL,
          role: 'ADMIN',
          socialLinks: {},
        },
      }, { status: 200 });
    }

    // ─── Normal DB-backed user ───
    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userObj = user.toObject();
    return NextResponse.json({
      user: {
        id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        socialLinks: userObj.socialLinks,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Me endpoint error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
