
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function run() {
  console.log("Attempting to connect to:", process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check if users collection has count
    const User = mongoose.connection.db.collection('users');
    const count = await User.countDocuments();
    console.log("User count:", count);
    
    process.exit(0);
  } catch(e) {
    console.error("DB Error:", e.message);
    process.exit(1);
  }
}
run();
