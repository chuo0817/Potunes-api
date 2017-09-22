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
  router.get('/playlists/', authentication, controllers.playlist.get)
  // 获取一篇文章下的歌曲
  router.get('/playlists/:id', authentication, controllers.playlist.get)
  // 新建文章
  router.get('/playlist/new', authentication, controllers.playlist.edit)
  router.post('/playlist/new', authentication, controllers.playlist.create)
  // 删除一篇文章
  router.post('/playlist/:id', authentication, controllers.playlist.del)
  // 草稿箱
  router.get('/drafts', authentication, controllers.playlist.draft)
  // 最近在听
  router.get('/purchas_listening', authentication, controllers.playlist.purchas_listening)
  // 发布草稿箱文章
  router.post('/ready', authentication, controllers.playlist.ready)
  // 获取某篇文章下面的所有歌曲
  router.get('/track-list', authentication, controllers.track_list.getTracks)
  // 更新一首歌信息
  router.post('/track-list', authentication, controllers.track_list.updateTrack)
  // 批量更新歌曲信息
  router.post('/track-list/:id', controllers.track_list.updateTracks)
  // 获取一首歌
  router.get('/tracks/', authentication, controllers.track_list.getOne)
  // 删除一首歌
  router.delete('/tracks/:id', authentication, controllers.track_list.deleteTrack)
  // 添加一首歌
  router.post('/tracks/new', authentication, controllers.tracks.create)
  router.get('/tracks/add', authentication, controllers.tracks.add)

  // 绝地求生
  // 解密群ID
  router.post('/pubg/getWxGroupId', controllers.pubg.getWxGroupId)
  // 获取绝地求生个人数据
  router.post('/pubg/getPubgUserInfo', controllers.pubg.getPubgUserInfo)

  return router
}
