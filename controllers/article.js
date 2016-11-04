import * as Articles from '../models/articles'
import * as Tracks from '../models/tracks'

export function* get(next) {
  if (this.params.id) {
    const tracks = yield Tracks.get(this.params.id)
    this.render('track_list', {
      tracks,
      title: '歌单',
      header: 'Playlist',
      page_id: this.params.id,
    })
    return null
  }
  if (this.query.id) {
    const article = yield Articles.getOne(this.query.id)
    this.render('new_article', {
      article,
      title: article.article_title,
      header: article.article_title,
    })
    return null
  }
  const articles = yield Articles.getAll()
  this.render('admin_index', {
    title: '管理员首页',
    header: 'AdminHome',
    articles,
  })
  return null
}

export function *edit(next) {
  this.render('new_article', {
    title: '新增文章',
    header: '新建',
    button: '走你',
  })
  return null
}


export function *create(next) {
  const body = this.request.body
  yield Articles.save(body)
  this.redirect('/api/admin/articles')
}


export function* getArticles(next) {
  const articles = yield Articles.getAllByMobile()
  return this.body = articles
}

export function* draft(next) {
  const articles = yield Articles.getDrafts()
  this.render('admin_index', {
    title: '草稿箱',
    header: 'articles',
    articles,
  })
  return null
}

export function* ready(next) {
  yield Articles.ready(this.request.body.article_id)
  return this.body = 'done'
}

export function* update(next) {
  console.log(this.request.body)
}
