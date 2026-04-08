import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

// Emergency bypass credentials - set these in .env.local or fall back to defaults
const BYPASS_EMAIL = (process.env.EMERGENCY_EMAIL || 'techteam@gmail.com').toLowerCase();
const BYPASS_PASSWORD = process.env.EMERGENCY_PASSWORD || 'techteam@2026';

function makeBypassResponse(email: string) {
  const token = signToken({ id: 'bypass-admin-001', role: 'ADMIN' });
  const response = NextResponse.json({
    message: 'Login successful',
    token,
    user: {
      id: 'bypass-admin-001',
      name: 'Tech Team',
      email,
      role: 'ADMIN',
      socialLinks: {},
    },
  }, { status: 200 });

  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}

export async function POST(req: NextRequest) {
  try {
    let { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    email = email.trim().toLowerCase();
    password = password ? password.trim() : '';

    // ─── Try connecting to DB ───
    let dbConnected = false;
    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (dbError) {
      console.error('[AUTH] DB CONNECTION ERROR:', dbError);
    }

    // ─── If DB is live, authenticate normally ───
    if (dbConnected) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password as string);
      if (!isMatch) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      const token = signToken({ id: user._id.toString(), role: user.role });
      const response = NextResponse.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          socialLinks: user.socialLinks,
        },
      }, { status: 200 });

      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    // ─── DB unavailable — use emergency bypass ───
    if (email === BYPASS_EMAIL && password === BYPASS_PASSWORD) {
      console.log('[AUTH] Emergency bypass login for:', email);
      return makeBypassResponse(email);
    }

    return NextResponse.json({ message: 'Database unavailable. Invalid bypass credentials.' }, { status: 503 });

  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
