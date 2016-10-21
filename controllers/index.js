import * as User from '../models/user'
import * as Articles from '../models/articles'
import * as Tracks from '../models/tracks'

// 首页
// export function *home(next) {
//   this.render('admin', {
//     title: '后台',
//   })
//   return null
// }
// 管理员登录
export function* adminLogin(next) {
  const body = this.request.body
  if (!body.name || !body.password) {
    return this.body = {
      status: 400,
      message: '{name} & {password} is required.',
    }
  }

  const user = yield User.get(body.name)
  delete user.password
  this.session.user = user

  this.redirect('/articles')
  return null
}

// 获取文章列表
export function *articles(next) {
  if (this.query.id) {
    const tracks = yield Tracks.get(this.query.id)
    this.render('track_list', {
      tracks,
      page_id: this.query.id,
    })
  } else {
    const article = yield Articles.getAll()
    this.body = article
    this.render('index', {
      title: '歌单',
      articles: article,
    })
  }
  return null
}

export function* home(next) {
  yield this.render('default', {
    meta_title: '首页',
    meta_description: 'Thoughts, stories and ideas.',
  })
}
