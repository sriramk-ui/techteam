import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { User } from './src/models/User';
import { Project } from './src/models/Project';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  try {
    const projects = await Project.find({ visibility: 'public' }).populate('assignedMembers', '_id name').lean();
    console.log("PROJECTS LENGTH:", projects.length);
    console.log(JSON.stringify(projects, null, 2));
  } catch(e) {
    console.error("ERROR!!", e);
  }
  process.exit(0);
}
run();
