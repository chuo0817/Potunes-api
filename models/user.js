import mysql from 'mysql'
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Potunes',
})


//存储用户信息
export function *save(next) {
  var userAddSql = 'INSERT INTO users(user_name,user_password,user_email) VALUES(?,?,?)';
  var userAddSql_Params = [this.name, this.password, this.email];

  pool.getConnection(function(err, connection) {
    connection.query(userAddSql, userAddSql_Params, function(err, result) {
      connection.release();
      if (err) {
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }
      console.log('-------INSERT----------');
      console.log('INSERT ID:',result);
      console.log('#######################');
    });
  });
}

export function get(name) {
  var userQuery = 'SELECT * FROM users where user_name = ?';
  var userQuerry_Params = name;

  return new Promise(function (resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(userQuery, userQuerry_Params, function(err, result) {
        connection.release();

        if (err) return reject(err);

        var user = {
            name:result[0].user_name,
            password:result[0].user_password,
            email:result[0].user_email,
        }
        resolve(user);
      });
    });
  });
}
