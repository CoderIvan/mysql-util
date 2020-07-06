function isNil(value) {
	return value === null || value === undefined
}

function setFields(squelSql, fields) {
	fields.forEach((field) => {
		squelSql.field(field)
	})
}

function setWhere(squelSql, data, fields) {
	fields.forEach((field) => {
		const value = data[field.split('.').pop()]
		if (!isNil(value)) {
			squelSql.where(`${field} = ?`, value)
		}
	})
}

function setPaging(squelSql, { offset, limit }) {
	if (offset >= 0) {
		squelSql.offset(offset)
	}
	if (limit >= 0) {
		squelSql.limit(limit)
	}
}

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
	setFields,
	setWhere,
	setPaging,
	setWhereRange,
}
