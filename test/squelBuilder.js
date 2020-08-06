/* eslint-env mocha */
const { expect } = require('chai')
const squel = require('squel')

const { setWhereRange } = require('../lib/squelBuilder')

describe('squelBuilder', () => {
	describe('#setWhereRange()', () => {
		const getSquel = () => squel.select().from('test')
		const expect01 = (squelSql) => {
			expect(squelSql.toString()).to.eql('SELECT * FROM test')
		}
		const expect02 = (squelSql) => {
			expect(squelSql.toString()).to.eql('SELECT * FROM test WHERE (timestamp >= 0) AND (timestamp < 1 )')
		}

		it('support fieldStart and fieldEnd', () => {
			const squelSql = getSquel()
			expect01(squelSql)
			setWhereRange(squelSql, {
				timestampStart: 0,
				timestampEnd: 1,
			}, ['timestamp'])
			expect02(squelSql)
		})

		it('support field_start and field_end', () => {
			const squelSql = getSquel()
			expect01(squelSql)
			setWhereRange(squelSql, {
				timestamp_start: 0,
				timestamp_end: 1,
			}, ['timestamp'])
			expect02(squelSql)
		})

		it('support field[0] and field[1]', () => {
			const squelSql = getSquel()
			expect01(squelSql)
			setWhereRange(squelSql, {
				timestamp: [0, 1],
			}, ['timestamp'])
			expect02(squelSql)
		})
	})
})
