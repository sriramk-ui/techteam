import connectToDatabase from '@/lib/db';
import { Project } from '@/models/Project';
import { Event } from '@/models/Event';
import { User } from '@/models/User';
import LandingPageClient from '@/components/LandingPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
  try {
    await connectToDatabase();
    
    // Count public projects
    const projectsCount = await Project.countDocuments({ visibility: 'public' });
    
    // Count all events
    const eventsCount = await Event.countDocuments({});
    
    // Count all users (team members)
    const membersCount = await User.countDocuments({});
    
    return {
      projectsCount,
      eventsCount,
      membersCount
    };
  } catch (error) {
    console.error('Error fetching home stats:', error);
    return {
      projectsCount: 0,
      eventsCount: 0,
      membersCount: 0
    };
  }
}

export default async function LandingPage() {
  const { projectsCount, eventsCount, membersCount } = await getStats();

  return (
    <LandingPageClient 
      projectsCount={projectsCount}
      eventsCount={eventsCount}
      membersCount={membersCount}
    />
  );
}
