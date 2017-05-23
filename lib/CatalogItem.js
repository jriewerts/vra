const requestPromise = require('request-promise');
const _ = require('lodash');

let rp = null;

class CatalogItem {

    constructor(obj, def) {

        rp = requestPromise.defaults(def);

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.dateCreated = new Date(obj.dateCreated);
        this.lastUpdatedDate = new Date(obj.lastUpdatedDate);
        this.status = obj.status;
        this.requestable = obj.requestable;
        this.version = obj.version;
    }

    getRequestTemplate() {
        return rp(`/catalog-service/api/consumer/entitledCatalogItems/${this.id}/requests/template`);
    }

    request(obj) {
        return this.getRequestTemplate()
            .then((template) => {
                return rp({
                    method: 'POST',
                    uri: `/catalog-service/api/consumer/entitledCatalogItems/${this.id}/requests`,
                    body: _.defaultsDeep(obj, template)
                });
            });
    }
}

module.exports = CatalogItem;