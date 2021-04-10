const Bluebird = require('bluebird')
const mysql = require('mysql')
const Connection = require('mysql/lib/Connection')
const Pool = require('mysql/lib/Pool')

const protoMap = require('./proto')

// eslint-disable-next-line import/newline-after-import
;[Connection.prototype, Pool.prototype].forEach((proto) => {
	Bluebird.promisifyAll(proto)
	Object.assign(proto, protoMap)
})

Pool.prototype.transaction = async function transaction(execute) {
	let connection
	try {
		connection = await this.getConnectionAsync()
		await connection.beginTransactionAsync()

		await execute(connection)

		await connection.commitAsync()
	} catch (err) {
		if (connection) {
			await connection.rollbackAsync()
		}
		throw err
	} finally {
		if (connection) {
			connection.release()
		}
	}
}

module.exports = mysql
