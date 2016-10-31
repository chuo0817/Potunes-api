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
  router.get('/tracks/:id', controllers.tracks.getOne)
  router.get('/lyrics/:id', controllers.tracks.getLrc)
  return router
}
