import Router from 'koa-router'
import _requiredir from 'require-dir'

const controllers = _requiredir('../controllers')

export default function() {
  const router = new Router({
    prefix: '/api/app',
  })
  // 歌单列表
  router.get('/articles', controllers.article.getArticles)
  // 歌单内歌曲
  router.get('/articles/:id', controllers.tracks.getTracks)
  return router
}
