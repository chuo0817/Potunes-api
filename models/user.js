import mysql from 'promise-mysql'

const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Potunes',
})


// 存储用户信息
export function *save(next) {
	const userAddSql = 'INSERT INTO users(user_name,user_password,user_email) VALUES(?,?,?)'
	const userAddSql_Params = [this.name, this.password, this.email]

	pool.getConnection()
	.then((connection) => {
		connection.query(userAddSql, userAddSql_Params)
		.then((result) => {
			pool.releaseConnection(connection)
			console.log('-------INSERT----------')
			console.log('INSERT ID:', result)
			console.log('#######################')
		})
	})
	.catch((err) => {
		console.log('[INSERT ERROR] - ', err.message)
	})
}

export function get(name) {
	const userQuery = 'SELECT * FROM users where user_name = ?'
	const userQuerry_Params = name

	return new Promise((resolve, reject) => {
		pool.getConnection()
		.then((connection) => {
			connection.query(userQuery, userQuerry_Params)
			.then((result) => {
				pool.releaseConnection(connection)
				const user = {
					name: result[0].user_name,
					password: result[0].user_password,
					email: result[0].user_email,
				}
				resolve(user)
			})
		})
		.catch((err) => {
			console.log(err.message)
			return reject(err)
		})
	})
}
