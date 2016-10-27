import * as Articles from '../models/articles'

export function* get(next) {
  const article = yield Articles.getAll()
  this.render('index', {
    title: '歌单',
    articles: article,
    page_id: this.params.id,
  })
  return null
}

export function *edit(next) {
  this.render('new_article', {
    title: '新增文章',
  })
}


export function *create(next) {
  const body = this.request.body
  yield Articles.save(body)
  this.redirect('/articles')
}
