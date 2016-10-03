import Router from 'koa-router'
import _requiredir from 'require-dir'

const controllers = _requiredir('./controllers')

export default function() {
	const router = new Router()

	router.get('/', ctx => {
		ctx.redirect('/adminCenter')
	})

	router.get('/admin', controllers.index.home)
	router.post('/admin', controllers.index.adminLogin)

	router.get('/articles', controllers.index.articles)

	router.get('/article/new', controllers.new_article.home)
	router.post('/article/new', controllers.new_article.post)

	router.get('/track-list', controllers.track_list.getTracks)
	router.post('/track-list/:id', controllers.track_list.updateTracks)
	router.post('/track-list', controllers.track_list.updateTrack)

	return router
}
