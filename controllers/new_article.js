import * as Articles from '../models/articles'

export function *home(next) {
	this.render('new_article', {
		title: '新增文章',
	})
}

export function *post(next) {
	const body = this.request.body
	yield Articles.save(body)
	this.redirect('/articles')
}
