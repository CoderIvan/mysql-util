const squel = require('squel')

squel.registerValueHandler(Buffer, (buffer) => buffer)

module.exports = squel
