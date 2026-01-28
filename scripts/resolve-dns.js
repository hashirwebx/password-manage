const dns = require('dns');

const srvHostname = '_mongodb._tcp.cluster0.kwepzkr.mongodb.net';

console.log(`Resolving SRV for: ${srvHostname}`);

dns.resolveSrv(srvHostname, (err, addresses) => {
    if (err) {
        console.error('SRV Resolution Error:', err);
        console.log('\n--- ATTEMPTING FALLBACK ---');
        // Common format fallback guess
        console.log('You might need to use the Standard Connection String from MongoDB Atlas dashboard.');
        return;
    }

    console.log('SRV Records found:');
    const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
    console.log(`\nYour Standard Connection String Hosts:\n${hosts}`);

    const standardURI = `mongodb://hashirkhan15432_db_user-password-manang:khanisking@${hosts}/?ssl=true&replicaSet=atlas-generic-shard-0&authSource=admin&appName=Cluster0`;

    console.log('\nSUGGESTED NEW CONNECTION STRING (Put this in your .env):');
    console.log(standardURI);
});
