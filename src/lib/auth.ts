import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export interface DecodedToken {
  id: string;
  role: 'ADMIN' | 'MEMBER';
}

export function signToken(payload: DecodedToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(req: NextRequest): DecodedToken | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
  }
  
  // Checking cookies as fallback
  const tokenCookie = req.cookies.get('token');
  if (tokenCookie) {
    return verifyToken(tokenCookie.value);
  }
  
  return null;
}
