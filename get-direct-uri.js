const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const srvHost = 'cluster0.atssx8t.mongodb.net';

dns.resolveSrv('_mongodb._tcp.' + srvHost, (err, addresses) => {
  if (err) {
    console.error('Failed to resolve SRV:', err);
    process.exit(1);
  }
  
  const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
  dns.resolveTxt(srvHost, (err, records) => {
    let authSource = 'authSource=admin&replicaSet=atlas-13p5of-shard-0'; 
    // Usually it resolves TXT for options like authSource=admin&replicaSet=...
    if (!err && records.length > 0) {
      authSource = records[0].join('');
    }
    
    require('fs').writeFileSync('uri.txt', `mongodb://dxtechteam2k26_db_user:db_techteam2k26@${hosts}/teamos?ssl=true&${authSource}`);
  });
});
