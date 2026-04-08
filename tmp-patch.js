const fs = require('fs');
let c = fs.readFileSync('.env.local', 'utf8');
c = c.replace(/MONGODB_URI=.+/, 'MONGODB_URI="mongodb://dxtechteam2k26_db_user:db_techteam2k26@ac-8zro4lk-shard-00-01.atssx8t.mongodb.net:27017,ac-8zro4lk-shard-00-02.atssx8t.mongodb.net:27017,ac-8zro4lk-shard-00-00.atssx8t.mongodb.net:27017/teamos?ssl=true&authSource=admin&replicaSet=atlas-i3ml48-shard-0"');
fs.writeFileSync('.env.local', c);
console.log('done');
