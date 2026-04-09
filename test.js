// test.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  require('./src/models/User');
  const { Project } = require('./src/models/Project');

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
