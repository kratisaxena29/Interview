const { exception } = require('console');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('#&$^');

function decrypt(text) {
    return new Promise((res, rej) => {
        try {
            res(cryptr.decrypt(text))
        } catch (error) {
            rej(error)
        }
    })
}

module.exports = { decrypt };