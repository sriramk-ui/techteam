import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Vault } from '@/models/Vault';
import { getUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';

const VAULT_SECRET = process.env.VAULT_SECRET || 'vault-secret-32-chars-long-key!!';
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(VAULT_SECRET, 'utf8').slice(0, 32), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(VAULT_SECRET, 'utf8').slice(0, 32), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// GET /api/vault/[projectId] — retrieve and decrypt vault (members + admin)
export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { projectId } = await params;
    await connectToDatabase();
    const vault = await Vault.findOne({ project_id: projectId }).populate('project_id', 'title');
    if (!vault) return NextResponse.json({ message: 'Vault not found' }, { status: 404 });
    
    // Return the encrypted vault entry plus decrypted data
    const decryptedData = decrypt(vault.encryptedData);
    return NextResponse.json({ vault, decryptedData }, { status: 200 });
  } catch (error) {
    console.error('Vault GET error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/vault/[projectId] — store encrypted secrets (admin only)
export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    const { projectId } = await params;
    const body = await req.json();

    // body.data is a JSON string of key-value pairs
    const rawData = body.data || JSON.stringify(body);
    const encryptedData = encrypt(rawData);

    await connectToDatabase();
    const vault = await Vault.findOneAndUpdate(
      { project_id: projectId },
      { project_id: projectId, encryptedData },
      { upsert: true, new: true }
    ).populate('project_id', 'title');

    return NextResponse.json({ message: 'Vault saved', vault }, { status: 200 });
  } catch (error) {
    console.error('Vault POST error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/vault/[projectId] — remove vault entry (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    const { projectId } = await params;
    await connectToDatabase();
    await Vault.findOneAndDelete({ project_id: projectId });
    return NextResponse.json({ message: 'Vault deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
