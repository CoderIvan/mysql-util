/* eslint-env mocha */
// eslint-disable-next-line import/no-unresolved
const { expect } = require('chai')
const squel = require('../lib/squel')

describe('squel', () => {
	describe('#normal', () => {
		const getSquel = () => squel.select().from('test')
		it('normal', () => {
			const s = getSquel()
			s.where('id = ?', Buffer.from('HelloWorld Ivan'))
			expect(s.toString()).to.eql('SELECT * FROM test WHERE (id = HelloWorld Ivan)')
		})
	})
})
