import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  try {
    console.log('Starting seed process...');
    await connectToDatabase();
    console.log('Connected to DB.');
    
    const usersToSeed = [
      { name: 'Sriram', email: 'sriramkalaikumar@gmail.com', pass: 'sk@130906', role: 'MEMBER' },
      { name: 'Hariharan', email: 'hariharank142006@gmail.com', pass: 'hari@142006', role: 'MEMBER' },
      { name: 'Gautham', email: 'gautham3177@gmail.com', pass: 'gautham@3177', role: 'MEMBER' },
      { name: 'Saravanan Prasath', email: 'saravanan.prasath0713@gmail.com', pass: 'saravana@0713', role: 'MEMBER' },
      { name: 'Tech Team', email: 'techteam@gmail.com', pass: 'techteam@2026', role: 'ADMIN' },
    ];

    const results = [];
    for (const u of usersToSeed) {
      console.log(`Checking user: ${u.email}`);
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        results.push({ email: u.email, status: 'Already exists' });
        continue;
      }
      
      console.log(`Hashing password for: ${u.email}`);
      const hashedPassword = await bcrypt.hash(u.pass, 10);
      
      console.log(`Creating user: ${u.email}`);
      const newUser = await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        socialLinks: { github: '', linkedin: '', instagram: '', gmail: u.email }
      });
      console.log(`Created user: ${newUser._id}`);
      results.push({ email: u.email, status: 'Created' });
    }

    console.log('Seed complete.');
    return NextResponse.json({ message: 'Seed complete', results }, { status: 200 });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ message: 'Seed failed', error: error.message }, { status: 500 });
  }
}
