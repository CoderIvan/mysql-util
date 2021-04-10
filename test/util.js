/* eslint-env mocha */
// eslint-disable-next-line import/no-unresolved
const { expect } = require('chai')
const squel = require('squel')

const { genUUID, setWhereRange, setFields, setWhere, setPaging } = require('../lib/util')

describe('util', () => {
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

	describe('#genUUID', () => {
		it('normal', () => {
			const result = genUUID()
			expect(result).to.be.an.instanceof(Buffer)
			expect(result.length).to.eql(16)
		})
	})

	describe('#setFields', () => {
		const getSquel = () => squel.select().from('test')
		it('normal', () => {
			const s = getSquel()
			setFields(s, ['a', 'b'])
			expect(s.toString()).to.eql('SELECT a, b FROM test')
		})
	})

	describe('#setWhere', () => {
		const getSquel = () => squel.select().from('test')
		it('normal', () => {
			const s = getSquel()
			setWhere(s, {
				a: 1,
				b: 2,
				c: 3,
			}, ['a', 'b'])
			expect(s.toString()).to.eql('SELECT * FROM test WHERE (a = 1) AND (b = 2)')
		})

		it('>', () => {
			const s = getSquel()
			setWhere(s, {
				a: 1,
				b: 2,
				c: 3,
			}, ['a', 'b'], '>')
			expect(s.toString()).to.eql('SELECT * FROM test WHERE (a > 1) AND (b > 2)')
		})
	})

	describe('#setPaging', () => {
		const getSquel = () => squel.select().from('test')
		it('normal', () => {
			const s = getSquel()
			setPaging(s, {
				limit: 10,
				offset: 10,
			}, ['a', 'b'], '>')
			expect(s.toString()).to.eql('SELECT * FROM test LIMIT 10 OFFSET 10')
		})
	})
})
