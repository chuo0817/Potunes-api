import Router from 'koa-router'
import _requiredir from 'require-dir'

const controllers = _requiredir('../controllers')

export default function() {
  const router = new Router({
    prefix: '/api/app',
  })
  // 歌单列表
  router.get('/playlists', controllers.playlist.getPlaylists)
  // 歌单内歌曲
  router.get('/playlists/:id', controllers.tracks.getTracks)
  router.get('/tracks/:id', controllers.tracks.getOne)
  router.get('/lyrics/:id', controllers.tracks.getLrc)
  router.get('/wechatlrc/:id', controllers.tracks.wechatlrc)

  router.get('/android/version', controllers.version.getAndroidVersion)

  return router
}
