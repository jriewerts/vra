const _ = require('lodash');

class VraError extends Error {
    constructor(err){

        if(_.isString(err)) {
            super(err);
        } else {
            super(err.message);
            this.code = err.code;
            this.systemMessage = err.systemMessage;
            this.moreInfoUrl = err.moreInfoUrl;
        }
    }
}

module.exports =  VraError;