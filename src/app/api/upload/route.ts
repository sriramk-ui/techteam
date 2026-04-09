import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const requester = getUserFromRequest(req);
    // Only logged in members can upload profile pics
    if (!requester) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: 'No file found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to a Data URI for storing directly in the DB
    // This avoids writing to the disk, which fails on Vercel (read-only filesystem)
    const mimeType = file.type || 'image/jpeg';
    const base64String = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64String}`;

    return NextResponse.json({ url: dataUri }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Internal server error during upload' }, { status: 500 });
  }
}
