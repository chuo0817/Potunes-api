import * as User from '../models/user'
import * as Articles from '../models/articles'

export function *home(next) {
	yield this.render('newArticle', {
		title: '新增文章',
	})
}

export function *post(next) {
	console.log(123)
  const body = this.request.body
	console.log(this.request.body)

	Articles.save(body)

	this.redirect('/articles')
}
