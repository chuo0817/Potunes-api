import mysql from 'promise-mysql'

const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Potunes',
})

export function* query(sql, params) {
	return new Promise((resolve, reject) => {
		pool.getConnection()
		.then(connection => {
			connection.query(sql, params)
			.then(res => {
				pool.releaseConnection(connection)
				resolve(res)
			})
		})
		.catch(err => {
			reject(err)
		})
	})
}
