import * as User from '../models/user'
import * as Articles from '../models/articles'

// 首页
export function *index(next) {
  this.render('login', {
    title: '后台',
  })
  return null
}
// 管理员登录
export function* login(next) {
  const body = this.request.body
  if (!body.email || !body.password) {
    return this.body = {
      status: 400,
      message: '{name} & {password} is required.',
    }
  }

  const user = yield User.get(body.email)
  delete user.password
  this.session.user = user

  this.redirect('/api/admin/articles/')
  return null
}
