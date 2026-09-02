import connectToDatabase from '@/lib/db';
import { Project } from '@/models/Project';
import { Event } from '@/models/Event';
import { User } from '@/models/User';
import LandingPageClient from '@/components/templates/LandingPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPortfolioData() {
  try {
    await connectToDatabase();
    
    // Fetch stats
    const projectsCount = await Project.countDocuments({ visibility: 'public' });
    const eventsCount = await Event.countDocuments({});
    const membersCount = await User.countDocuments({});
    
    // Fetch top public projects (up to 6 for showcase)
    const rawProjects = await Project.find({ visibility: 'public' })
      .populate('assignedMembers', 'name')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
      
    // Fetch team members (up to 8 for showcase)
    const rawMembers = await User.find({})
      .select('name role profilePic socialLinks')
      .limit(8)
      .lean();

    // Fetch recent events (up to 3 for showcase)
    const rawEvents = await Event.find({})
      .populate('assignedMembers', 'name')
      .sort({ date: -1 })
      .limit(3)
      .lean();
    
    return {
      stats: {
        projectsCount,
        eventsCount,
        membersCount,
      },
      featuredProjects: JSON.parse(JSON.stringify(rawProjects)),
      teamMembers: JSON.parse(JSON.stringify(rawMembers)),
      recentEvents: JSON.parse(JSON.stringify(rawEvents)),
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return {
      stats: { projectsCount: 0, eventsCount: 0, membersCount: 0 },
      featuredProjects: [],
      teamMembers: [],
      recentEvents: [],
    };
  }
}

export default async function LandingPage() {
  const { stats, featuredProjects, teamMembers, recentEvents } = await getPortfolioData();

  return (
    <LandingPageClient 
      stats={stats}
      featuredProjects={featuredProjects}
      teamMembers={teamMembers}
      recentEvents={recentEvents}
    />
  );
}

