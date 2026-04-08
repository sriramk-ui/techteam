import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Project } from '@/models/Project';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Find all public projects, populate the assigned members but only return their names, roles, social links
    const projects = await Project.find({ visibility: 'public' })
      .populate('assignedMembers', 'name role socialLinks')
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Fetch public projects error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
