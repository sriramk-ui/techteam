import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Project } from '@/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Internal API returns all projects
    const projects = await Project.find()
      .populate('assignedMembers', 'name role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Fetch all projects error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    // Only Admin can create projects
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const data = await req.json();
    await connectToDatabase();
    
    const newProject = await Project.create(data);
    return NextResponse.json({ message: 'Project created', project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Create project error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
