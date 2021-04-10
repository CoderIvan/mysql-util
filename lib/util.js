const uuid = require('uuid')

function genUUID() {
	return uuid.v4({}, Buffer.alloc(16))
}

function isNil(value) {
	return value === undefined
}

function setFields(squelSql, fields) {
	fields.forEach((field) => {
		squelSql.field(field)
	})
}

function setWhere(squelSql, data, fields, opt = '=') {
	fields.forEach((field) => {
		const value = data[field.split('.').pop()]
		if (!isNil(value)) {
			squelSql.where(`${field} ${opt} ?`, value)
		}
	})
}

function setPaging(squelSql, { offset, limit }) {
	if (offset > 0) {
		squelSql.offset(offset)
	}
	if (limit > 0) {
		squelSql.limit(limit)
	}
}

/**
 * 范围查询
 * 范围默认使用左闭右开
 *
 * 支持三种形式，（例field为timestamp时）:
 * timestampStart和timestampEnd
 * timestamp_start和timestamp_end
 * timestamp[0]和timestamp[1]
 * @param {*} squelSql squel
 * @param {*} data 数据体
 * @param {*} fields 字段名
 */
function setWhereRange(squelSql, data, fields) {
	fields.forEach((field) => {
		const shortField = field.split('.').pop()

		let start
		let end

		if (!isNil(data[`${shortField}Start`]) || !isNil(data[`${shortField}End`])) {
			start = data[`${shortField}Start`]
			end = data[`${shortField}End`]
		} else if (!isNil(data[`${shortField}_start`]) || !isNil(data[`${shortField}_end`])) {
			start = data[`${shortField}_start`]
			end = data[`${shortField}_end`]
		} else if (data[shortField] instanceof Array && data[shortField].length === 2) {
			[start, end] = data[shortField]
		}

		if (!isNil(start)) {
			squelSql.where(`${field} >= ?`, start)
		}
		if (!isNil(end)) {
			squelSql.where(`${field} < ? `, end)
		}
	})
}

module.exports = {
	genUUID,
	setFields,
	setWhere,
	setPaging,
	setWhereRange,
}
