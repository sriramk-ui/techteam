/* eslint-disable @typescript-eslint/no-var-requires */
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

async function test() {
  // Hardcoded URI from the user (trying with brackets first)
  const uri = "mongodb+srv://dxtechteam2k26_db_user:<db_techteam2k26>@cluster0.atssx8t.mongodb.net/teamos?retryWrites=true&w=majority&appName=Cluster0";
  console.log('Testing URI with brackets...');
  try {
    await mongoose.connect(uri);
    console.log('SUCCESS: Connected with brackets.');
    process.exit(0);
  } catch (err) {
    console.log('FAILED with brackets:', err.message);
    
    // Try without brackets
    const uri2 = "mongodb+srv://dxtechteam2k26_db_user:db_techteam2k26@cluster0.atssx8t.mongodb.net/teamos?retryWrites=true&w=majority&appName=Cluster0";
    console.log('Testing URI without brackets...');
    try {
      await mongoose.connect(uri2);
      console.log('SUCCESS: Connected without brackets.');
      process.exit(0);
    } catch (err2) {
      console.error('FINAL FAILURE:', err2.message);
      process.exit(1);
    }
  }
}

test();
