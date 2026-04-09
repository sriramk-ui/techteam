import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import { Project } from '@/models/Project';
import { Event } from '@/models/Event';

export async function GET() {
  try {
    console.log('Starting seed process...');
    await connectToDatabase();
    console.log('Connected to DB.');
    
    const usersToSeed = [
      { 
        name: 'Sriram', 
        email: 'sriramkalaikumar@gmail.com', 
        pass: 'sk@130906', 
        role: 'MEMBER',
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' 
      },
      { 
        name: 'Hariharan', 
        email: 'hariharank142006@gmail.com', 
        pass: 'hari@142006', 
        role: 'MEMBER',
        profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
      },
      { 
        name: 'Gautham', 
        email: 'gautham3177@gmail.com', 
        pass: 'gautham@3177', 
        role: 'MEMBER',
        profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop'
      },
      { 
        name: 'Saravanan Prasath', 
        email: 'saravanan.prasath0713@gmail.com', 
        pass: 'saravana@0713', 
        role: 'MEMBER',
        profilePic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop'
      },
      { 
        name: 'Tech Team', 
        email: 'techteam@gmail.com', 
        pass: 'techteam@2026', 
        role: 'ADMIN',
        profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop'
      },
    ];

    const results = [];
    for (const u of usersToSeed) {
      console.log(`Checking user: ${u.email}`);
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        // Update existing user with profile pic if missing
        exists.profilePic = u.profilePic;
        await exists.save();
        results.push({ email: u.email, status: 'Updated profile picture' });
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
        profilePic: u.profilePic,
        socialLinks: { github: '', linkedin: '', instagram: '', gmail: u.email }
      });
      console.log(`Created user: ${newUser._id}`);
      results.push({ email: u.email, status: 'Created' });
    }

    console.log('Seed complete.');

    // Seed Projects
    const adminUser = await User.findOne({ role: 'ADMIN' });
    const memberUser = await User.findOne({ role: 'MEMBER' });
    const assignedIds = [adminUser?._id, memberUser?._id].filter(Boolean);

    const projectsToSeed = [
      {
        title: 'AgroMind Detection',
        description: 'AI-powered crop disease detection and automated mitigation system using high-resolution spectral imagery.',
        status: 'Active',
        visibility: 'public',
        progress: 65,
        githubUrl: 'https://github.com/techteam/agromind',
        assignedMembers: assignedIds
      },
      {
        title: 'Loopy Admin Portal',
        description: 'A sophisticated enterprise-grade management system designed for scale, featuring real-time analytics and RBAC.',
        status: 'Completed',
        visibility: 'public',
        progress: 100,
        demoUrl: 'https://loopy.example.com',
        assignedMembers: assignedIds
      },
      {
        title: 'Antigravity Core',
        description: 'High-performance distributed backend engine for real-time team collaboration and state synchronization.',
        status: 'Planning',
        visibility: 'public',
        progress: 15,
        assignedMembers: [adminUser?._id].filter(Boolean)
      },
      {
        title: 'BioSync Monitor',
        description: 'Next-generation health tracking platform integrating IoT wearable data with predictive medical diagnostics.',
        status: 'Active',
        visibility: 'public',
        progress: 40,
        assignedMembers: assignedIds
      }
    ];

    for (const p of projectsToSeed) {
      const exists = await Project.findOne({ title: p.title });
      if (!exists) {
        await Project.create(p as any);
        results.push({ title: p.title, type: 'Project', status: 'Created' });
      }
    }

    // Seed Events
    const eventsToSeed = [
      {
        name: 'Hack the North 2025',
        type: 'Hackathon',
        date: new Date('2025-09-15'),
        visibility: 'public',
        result: 'Finalist - Top 10',
        assignedMembers: assignedIds
      },
      {
        name: 'Open Source Summit',
        type: 'Conference',
        date: new Date('2025-07-20'),
        visibility: 'public',
        result: 'Guest Speaker',
        assignedMembers: [adminUser?._id].filter(Boolean)
      },
      {
        name: 'Imagine Cup Global',
        type: 'Competition',
        date: new Date('2025-05-10'),
        visibility: 'public',
        result: 'First Place - Tech Category',
        assignedMembers: assignedIds
      }
    ];

    for (const e of eventsToSeed) {
      const exists = await Event.findOne({ name: e.name });
      if (!exists) {
        await Event.create(e as any);
        results.push({ name: e.name, type: 'Event', status: 'Created' });
      }
    }

    return NextResponse.json({ message: 'Seed complete', results }, { status: 200 });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ message: 'Seed failed', error: error.message }, { status: 500 });
  }
}
