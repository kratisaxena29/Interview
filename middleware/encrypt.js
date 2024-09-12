
const { exception } = require('console');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('#&$^');

function encrypt(text) {

    return new Promise((res, rej) => {
        try {
            res(cryptr.encrypt(text))
        } catch (error) {
            rej(error)
        }
    })

}



module.exports = { encrypt };