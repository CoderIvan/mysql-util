const squel = require('./squel')
const util = require('./util')

/* eslint-disable no-underscore-dangle */
function getPagingSquel(squelSql) {
	const newSquelSql = squelSql
	newSquelSql.blocks[9]._orders = []
	newSquelSql.blocks[10]._value = null
	newSquelSql.blocks[11]._value = null
	if (newSquelSql.blocks[7]._groups.length) {
		newSquelSql.blocks[3]._fields = [{ name: '1', options: {} }]
		return squel.select().field('COUNT(*)', '_count').from(newSquelSql)
	}
	newSquelSql.blocks[3]._fields = [{ name: 'COUNT(*)', alias: '_count', options: {} }]
	return newSquelSql
}

function genSquel(squelInstance /* or Build Function */) {
	if (squelInstance instanceof Function) {
		return squelInstance(squel, util)
	}
	return squelInstance
}

module.exports = {
	exec(param) {
		const { text, values } = genSquel(param).toParam()
		return this.queryAsync(text, values)
	},

	execOne(...args) {
		return this.exec(...args).then((results) => results[0])
	},

	execCount(param) {
		return this.exec(getPagingSquel(genSquel(param)))
	},

	originPage(param) {
		const newParam = genSquel(param)
		return Promise.all([
			this.exec(newParam),
			this.execCount(newParam),
		])
	},

	async page(param) {
		const [rows, originCount] = await this.originPage(param)

		let count
		if (originCount && originCount.length > 0 && originCount[0]._count > 0) {
			count = originCount[0]._count
		} else {
			count = 0
		}

		return {
			rows,
			count,
		}
	},
}
