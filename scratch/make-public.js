const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://dxtechteam2k26_db_user:db_techteam2k26@ac-8zro4lk-shard-00-01.atssx8t.mongodb.net:27017,ac-8zro4lk-shard-00-02.atssx8t.mongodb.net:27017,ac-8zro4lk-shard-00-00.atssx8t.mongodb.net:27017/teamos?ssl=true&authSource=admin&replicaSet=atlas-i3ml48-shard-0';
const ProjectSchema = new mongoose.Schema({ title: String, visibility: String }, { strict: false });
const Project = mongoose.model('Project', ProjectSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  const r = await Project.updateOne({ title: 'LCK 13' }, { $set: { visibility: 'public' } });
  console.log('Modified:', r.modifiedCount);
  process.exit(0);
}
run().catch(console.error);
