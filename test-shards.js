const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb://dxtechteam2k26_db_user:db_techteam2k26@ac-8zro4lk-shard-00-01.atssx8t.mongodb.net:27017,ac-8zro4lk-shard-00-02.atssx8t.mongodb.net:27017,ac-8zro4lk-shard-00-00.atssx8t.mongodb.net:27017/teamos?ssl=true&authSource=admin&replicaSet=atlas-i3ml48-shard-0";

async function test() {
  console.log('Testing shard connection...');
  try {
    await mongoose.connect(uri);
    console.log('SUCCESS: Connected to shards!');
    process.exit(0);
  } catch (err) {
    console.error('FAILED to connect to shards:', err.message);
    process.exit(1);
  }
}

test();
