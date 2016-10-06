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

	// 获取某篇文章下面的所有歌曲
	router.get('/track-list', controllers.track_list.getTracks)
	// 更新一首歌信息
	router.post('/track-list', controllers.track_list.updateTrack)
	// 批量更新歌曲信息
	router.post('/track-list/:id', controllers.track_list.updateTracks)
	// 获取一首歌
	router.get('/tracks/', controllers.track_list.getOne)
	// 删除一首歌
	router.delete('/tracks/:id', controllers.track_list.deleteTrack)

	// 获取旧服务器内容
	router.get('/tracks/fetch-old', controllers.tracks.fetchOld)

	return router
}
