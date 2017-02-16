import * as pool from '../models/db'

export function* getAndroidVersion(next) {
  const versionQuery = 'SELECT * FROM version where id = 1'
  const version = yield pool.query(versionQuery)
  return this.body = version
}
