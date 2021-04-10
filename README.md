# mysql util

![Node.js CI](https://github.com/CoderIvan/mysql-util/workflows/Node.js%20CI/badge.svg)
![Node.js Package](https://github.com/CoderIvan/mysql-util/workflows/Node.js%20Package/badge.svg)

# Unit Test
![image](https://user-images.githubusercontent.com/7960859/114267955-377dd300-9a31-11eb-9c84-553cdaf799e4.png)
![image](https://user-images.githubusercontent.com/7960859/114267957-3ba9f080-9a31-11eb-8ce2-91202bf090a4.png)

# How To Use

```javascript
const { mysql } = require('@z-ivan/mysql-util')

const pool = mysql.createPool({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'test',
})

// SELECT * FROM test
await pool.exec((squel) => squel.select().from('test'))


// SELECT * FROM test LIMIT 10 OFFSET 10
// SELECT 1 FROM test
await pool.page((squel) => squel.select().from('test').limit(10).offset(10))

pool.end()
```
