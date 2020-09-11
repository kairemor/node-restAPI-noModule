// Helpers for some specfic tas k

const crypto = require('crypto')
const config = require('..config/')


// Container  fro all helpers 

const helpers = {}

//create a SHA256 hase
helpers.hash = (str) => {
    if (typeof (str) == 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret.update(str).digest('hex'))
        return hash
    } else {
        return false
    }
}

module.exports = helpers