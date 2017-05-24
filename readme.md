# VRA Client for all things Node.JS


    const VraClient = require('vra').VraClient;

    let vra = new VraClient('https://vra-url');

    vra.login('tenant', 'username', 'password')
        .then(() => vra.getCatalogItem('CentOS'))
        .then((item) => item.request({
            description: `automated request of CentOS`,
        }))
        .then((res) => {
            console.info('request success!');
        });


