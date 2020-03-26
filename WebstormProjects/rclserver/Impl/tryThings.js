var dns = require('dns');


const callback = (e)=>console.log(e);

dns.lookupService('10.251.167.76', 22, (err, hostname, service) => {
    console.log(hostname, service);
});
