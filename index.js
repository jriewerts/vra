const VraClient = require('./lib/VraClient');

let vra = new VraClient('https://vra.shareddev.acxiom.net');
let dl = null;

vra.login('vsphere.local', '**********@corp.acxiom.net', '***************')
    .then(() => vra.getCatalogItem('CentOS 6.5'))
    .then((item) => {
        dl = item;
        console.info(`Found catalog item ${item.name}: ${item.id}`);
        return dl;
    })
    .then((dl) => dl.request({
        description: 'automation test 1'
    }))
    .then((res) => {
        console.info('request success!');
        console.dir(res);
    })
    .catch((err) => {
        console.error(err);
    });


