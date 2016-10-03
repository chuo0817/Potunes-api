import * as User from '../models/user'
import * as Articles from '../models/articles'

// 首页
export function *home(next) {
	yield this.render('admin', {
		title: '后台',
	})
}
// 管理员登录
export function *adminLogin(next) {
	const body = this.request.body
	console.log('enter')
	console.log(body)

	if (!body.name || !body.password) {
		return this.body = {
			status: 400,
			message: '{name} & {password} is required.',
		}
	}

	const user = yield User.get(body.name)

	console.log(user.name)
  // this.session.user = user;
	this.redirect('/articles')
	return null
}

// 获取文章列表
export function *articles(next) {
	const article = yield Articles.getAll()
	yield this.render('index', {
		title: '歌单',
		articles: article,
	})
	return null
}
