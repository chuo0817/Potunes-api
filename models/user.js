import * as pool from '../models/db'

// 存储用户信息
export function *save(next) {
  const userAddSql = 'INSERT INTO users(user_name,user_password,user_email) VALUES(?,?,?)'
  const userAddSql_Params = [this.name, this.password, this.email]
  const result = yield pool.query(userAddSql, userAddSql_Params)
  return result
}

export function *get(name) {
  const userQuery = 'SELECT * FROM users where user_name = ?'
  const userQuerry_Params = name
  const result = yield pool.query(userQuery, userQuerry_Params)
  const user = {
    name: result[0].user_name,
    password: result[0].user_password,
    email: result[0].user_email,
  }
  return user
}
