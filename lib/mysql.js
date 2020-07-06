/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
const Bluebird = require('bluebird')
const mysql = require('mysql')
const Connection = require('mysql/lib/Connection')
const Pool = require('mysql/lib/Pool')
const squel = require('./squel')

/* eslint-disable no-underscore-dangle */
function getPagingSquel(squelSql) {
	const newSquelSql = squelSql.clone()
	newSquelSql.blocks[3]._fields = [{ name: 'COUNT(*)', alias: 'count', options: {} }]
	newSquelSql.blocks[9]._orders = []
	newSquelSql.blocks[10]._value = null
	newSquelSql.blocks[11]._value = null
	if (newSquelSql.blocks[7]._groups.length) {
		return squel.select().field('COUNT(*)', 'count').from(newSquelSql, 'temp')
	}
	return newSquelSql
}
/* eslint-enable no-underscore-dangle */

const prototypeArray = [Connection.prototype, Pool.prototype]

prototypeArray.forEach((proto) => {
	Bluebird.promisifyAll(proto)

	proto.queryBySquel = function (squelSql) {
		const { text, values } = squelSql.toParam()
		return this.queryAsync(text, values)
	}

	proto.pagingQueryBySquel = async function (squelSql) {
		const [count, rows] = await Promise.all([
			this.queryBySquel(getPagingSquel(squelSql))
				.then((records) => {
					if (records && records.length > 0 && records[0].count > 0) {
						return records[0].count
					}
					return 0
				}),
			this.queryBySquel(squelSql),
		])
		return {
			count,
			rows,
		}
	}
})

Pool.prototype.batchQueryBySquel = async function (sqls) {
	let connection
	try {
		connection = await this.getConnectionAsync()
		await connection.beginTransactionAsync()

		const results = []
		for (let i = 0; i < sqls.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			results.push(await connection.queryBySquel(sqls[i]))
		}
		await connection.commitAsync()
		return results
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
