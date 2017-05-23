let requestPromise = require('request-promise');
let Promise = require('bluebird');
let VraError = require('./VraError');
let CatalogItem = require('./CatalogItem');

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


// requestPromise.debug = true;
let rpDefaults = {
    headers: {
        Authorization: ''
    },
    baseUrl: '',
    json: true,
    strictSSL: false
};
let rp = null;

class VraClient {

    constructor(vraUrl){
        rpDefaults.baseUrl = vraUrl;
        rp = requestPromise.defaults(rpDefaults);
    }

    login(tenant, username, password) {
        return rp({
            method: 'POST',
            uri: '/identity/api/tokens',
            body: {
                tenant,
                username,
                password,
            }
        }).then((res) => {
            rpDefaults.headers.Authorization = `Bearer ${res.id}`;
            rp = requestPromise.defaults(rpDefaults);
            return res;
        });
    }

    getCatalog(filter, limit, top=1000, skip){
        return rp({
            uri: '/catalog-service/api/consumer/entitledCatalogItems',
            qs: {
                $filter: filter,
                $limit: limit,
                $top: top,
                $skip: skip,
            }
        });
    }

    getCatalogItem(identifier){

        let p = null;

        if(GUID.test(identifier)){
            p = rp(`/catalog-service/api/consumer/entitledCatalogItems/${identifier}`)
                .then((res) => {
                    return new CatalogItem(res.catalogItem, rpDefaults);
                });
        } else {
            p = this.getCatalog(`name eq '${identifier}'`)
                .then((res) => {
                    if (res.metadata.totalElements !== 1) {
                        throw new VraError(`trouble resolving catalog item ${identifier}`);
                    }
                    return new CatalogItem(res.content[0].catalogItem, rpDefaults);
                });
        }

        return p
            .catch((err) => {
                throw new VraError(err);
            });
    }
}

module.exports = VraClient;
