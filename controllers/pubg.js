import * as Pubg from '../models/pubg'

export function* getWxGroupId(next) {
  const body = this.request.body
  const result = yield Pubg.encryptData(body)
  console.log(result)
  return this.body = result
}

export function* getPubgUserInfo(next) {
  const body = this.request.body
  const user_info = yield Pubg.getPubgUserInfo(body)
  return this.body = user_info
}
