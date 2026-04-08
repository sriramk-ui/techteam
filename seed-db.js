const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const URI = "mongodb://dxtechteam2k26_db_user:db_techteam2k26@ac-8zro4lk-shard-00-01.atssx8t.mongodb.net:27017,ac-8zro4lk-shard-00-02.atssx8t.mongodb.net:27017,ac-8zro4lk-shard-00-00.atssx8t.mongodb.net:27017/teamos?ssl=true&authSource=admin&replicaSet=atlas-i3ml48-shard-0";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' },
  profilePic: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    gmail: { type: String, default: '' },
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  console.log('Connecting to DB for seeding...');
  try {
    await mongoose.connect(URI);
    console.log('Connected.');

    const usersToSeed = [
      { name: 'Sriram', email: 'sriramkalaikumar@gmail.com', pass: 'sk@130906', role: 'MEMBER' },
      { name: 'Hariharan', email: 'hariharank142006@gmail.com', pass: 'hari@142006', role: 'MEMBER' },
      { name: 'Gautham', email: 'gautham3177@gmail.com', pass: 'gautham@3177', role: 'MEMBER' },
      { name: 'Saravanan Prasath', email: 'saravanan.prasath0713@gmail.com', pass: 'saravana@0713', role: 'MEMBER' },
      { name: 'Tech Team', email: 'techteam@gmail.com', pass: 'techteam@2026', role: 'ADMIN' },
    ];

    for (const u of usersToSeed) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`User ${u.email} already exists.`);
        continue;
      }
      
      const hashedPassword = await bcrypt.hash(u.pass, 10);
      await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        socialLinks: { gmail: u.email }
      });
      console.log(`Created user: ${u.email}`);
    }

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
