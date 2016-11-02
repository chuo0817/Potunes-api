import Router from 'koa-router'
import _requiredir from 'require-dir'
import authentication from '../lib/authentication'

const controllers = _requiredir('../controllers')

export default function() {
  const router = new Router({
    prefix: '/api/admin',
  })

  // 管理员登录
  router.get('/', controllers.admin.index)
  router.post('/', controllers.admin.login)
  // 管理员首页
  router.get('/articles/', authentication, controllers.article.get)
  // 获取一篇文章下的歌曲
  router.get('/articles/:id', authentication, controllers.article.get)
  // 新建文章
  router.get('/article/new', authentication, controllers.article.edit)
  router.post('/article/new', authentication, controllers.article.create)
  // 草稿箱
  router.get('/drafts', authentication, controllers.article.draft)
  // 发布草稿箱文章
  router.post('/ready', authentication, controllers.article.ready)
  // 获取某篇文章下面的所有歌曲
  router.get('/track-list', authentication, controllers.track_list.getTracks)
  // 更新一首歌信息
  router.post('/track-list', authentication, controllers.track_list.updateTrack)
  // 批量更新歌曲信息
  router.post('/track-list/:id', authentication, controllers.track_list.updateTracks)
  // 获取一首歌
  router.get('/tracks/', authentication, controllers.track_list.getOne)
  // 删除一首歌
  router.delete('/tracks/:id', authentication, controllers.track_list.deleteTrack)
  // 获取旧服务器内容
  router.get('/tracks/fetch-old', authentication, controllers.tracks.fetchOld)
  return router
}
