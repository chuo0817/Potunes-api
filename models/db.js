import mysql from 'promise-mysql'

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '112.124.36.151',
  user: 'root',
  password: 'Purchasr7',
  database: 'Potunes',
})

export function* query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.getConnection()
    .then(connection => {
      connection.query(sql, params)
      .then(res => {
        pool.releaseConnection(connection)
        // console.log('-------INSERT----------')
        // console.log('INSERT ID:', res)
        // console.log('#######################')
        resolve(res)
      })
    })
    .catch(err => {
      reject(err)
    })
  })
}


export function cr(sql, params) {
  return (cb) => {
    pool.getConnection()
    .then((connection) => {
      connection.query(sql, params)
      .then((result) => {
        pool.releaseConnection(connection)
        cb(null, result)
      })
    })
    .catch((err) => {
      console.log(err.message)
      cb(err)
    })
  }
}
