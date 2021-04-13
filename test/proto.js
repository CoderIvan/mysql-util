/* eslint-env mocha */
const { expect } = require('chai')
const squel = require('squel')

const protoMap = require('../lib/proto')

describe('proto', () => {
	const mock = {
		queryAsync: async (...args) => [args],
	}

	Object.assign(mock, protoMap)

	it('Exec', async () => {
		const results = await mock.exec(squel.select().from('test').where('1 = ?', 1))
		expect(results).to.be.an('array')
		expect(results.length).to.equal(1)
		expect(results[0]).to.be.an('array')
		expect(results[0][0]).to.eql('SELECT * FROM test WHERE (1 = ?)')
		expect(results[0][1]).to.eql([1])
	})

	it('ExecOne', async () => {
		const results = await mock.execOne(squel.select().from('test').where('1 = ?', 1))
		expect(results).to.be.an('array')
		expect(results[0]).to.eql('SELECT * FROM test WHERE (1 = ?)')
		expect(results[1]).to.eql([1])
	})

	it('Exec with builder', async () => {
		const results = await mock.exec((frameworkSquel) => frameworkSquel.select().from('test').where('1 = ?', 1))
		expect(results).to.be.an('array')
		expect(results.length).to.equal(1)
		expect(results[0]).to.be.an('array')
		expect(results[0][0]).to.eql('SELECT * FROM test WHERE (1 = ?)')
		expect(results[0][1]).to.eql([1])
	})

	it('ExecOne with builder', async () => {
		const results = await mock.execOne((frameworkSquel) => frameworkSquel.select().from('test').where('1 = ?', 1))
		expect(results).to.be.an('array')
		expect(results[0]).to.eql('SELECT * FROM test WHERE (1 = ?)')
		expect(results[1]).to.eql([1])
	})

	it('ExecCount', async () => {
		const results = await mock.execCount(squel.select().from('test').where('1 = ?', 1))
		expect(results).to.be.an('array')
		expect(results.length).to.equal(1)
		expect(results[0]).to.be.an('array')
		expect(results[0][0]).to.eql('SELECT COUNT(*) AS "_count" FROM test WHERE (1 = ?)')
		expect(results[0][1]).to.eql([1])
	})

	it('ExecCount with builder', async () => {
		const results = await mock.execCount((frameworkSquel) => frameworkSquel.select().from('test').where('1 = ?', 1))
		expect(results).to.be.an('array')
		expect(results.length).to.equal(1)
		expect(results[0]).to.be.an('array')
		expect(results[0][0]).to.eql('SELECT COUNT(*) AS "_count" FROM test WHERE (1 = ?)')
		expect(results[0][1]).to.eql([1])
	})

	it('ExecCount With GroupBy', async () => {
		const results = await mock.execCount(squel.select().from('test').where('1 = ?', 1).group('id'))

		expect(results).to.be.an('array')
		expect(results.length).to.equal(1)
		expect(results[0]).to.be.an('array')
		expect(results[0][0]).to.eql('SELECT COUNT(*) AS "_count" FROM (SELECT 1 FROM test WHERE (1 = ?) GROUP BY id) `_temp`')
		expect(results[0][1]).to.eql([1])
	})

	it('ExecCount With GroupBy with builder', async () => {
		const results = await mock.execCount(squel.select().from('test').where('1 = ?', 1).group('id'))

		expect(results).to.be.an('array')
		expect(results.length).to.equal(1)
		expect(results[0]).to.be.an('array')
		expect(results[0][0]).to.eql('SELECT COUNT(*) AS "_count" FROM (SELECT 1 FROM test WHERE (1 = ?) GROUP BY id) `_temp`')
		expect(results[0][1]).to.eql([1])
	})

	it('OriginPage With GroupBy', async () => {
		const results = await mock.originPage(squel.select().from('test').where('1 = ?', 1).group('id'))

		expect(results).to.be.an('array')
		expect(results.length).to.equal(2)
		const rows = results[0]
		expect(rows).to.be.an('array')
		expect(rows.length).to.equal(1)
		expect(rows[0]).to.be.an('array')
		expect(rows[0][0]).to.eql('SELECT * FROM test WHERE (1 = ?) GROUP BY id')
		expect(rows[0][1]).to.eql([1])
		const count = results[1]
		expect(count).to.be.an('array')
		expect(count.length).to.equal(1)
		expect(count[0]).to.be.an('array')
		expect(count[0][0]).to.eql('SELECT COUNT(*) AS "_count" FROM (SELECT 1 FROM test WHERE (1 = ?) GROUP BY id) `_temp`')
		expect(count[0][1]).to.eql([1])
	})

	it('OriginPage With GroupBy with builder', async () => {
		let tick = 0

		const results = await mock.originPage((frameworkSquel) => {
			tick += 1
			return frameworkSquel.select().from('test').where('1 = ?', 1).group('id')
		})

		expect(results).to.be.an('array')
		expect(results.length).to.equal(2)
		const rows = results[0]
		expect(rows).to.be.an('array')
		expect(rows.length).to.equal(1)
		expect(rows[0]).to.be.an('array')
		expect(rows[0][0]).to.eql('SELECT * FROM test WHERE (1 = ?) GROUP BY id')
		expect(rows[0][1]).to.eql([1])
		const count = results[1]
		expect(count).to.be.an('array')
		expect(count.length).to.equal(1)
		expect(count[0]).to.be.an('array')
		expect(count[0][0]).to.eql('SELECT COUNT(*) AS "_count" FROM (SELECT 1 FROM test WHERE (1 = ?) GROUP BY id) `_temp`')
		expect(count[0][1]).to.eql([1])

		expect(tick).eql(1)
	})
})
