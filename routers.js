import Router from 'koa-router'
import _requiredir from 'require-dir'

const controllers = _requiredir('./controllers')

export default function() {
	const router = new Router()

	router.get('/', ctx => {
		ctx.redirect('/adminCenter')
	})

	router.get('/adminCenter', controllers.index.home)
	router.post('/adminCenter', controllers.index.adminLogin)

	router.get('/articles', controllers.index.articles)

	router.get('/newArticle', controllers.newArticle.home)
	router.post('/newArticle', controllers.newArticle.post)

	router.get('/track-list', controllers.track_list.getTracks)
	router.post('/track-list', controllers.track_list.updateTracks)

	return router
}
