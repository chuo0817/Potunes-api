import Router from 'koa-router'
import _requiredir from 'require-dir'

const controllers = _requiredir('../controllers')

export default function() {
  function *cors(next) {
    const header = this
    header.set('Access-Control-Allow-Origin', '*');
    header.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    header.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    header.set('Access-Control-Allow-Credentials', true)
    yield next
  }

  const router = new Router({
    prefix: '/api/app',
  })
  // 歌单列表
  router.get('/playlists', cors, controllers.playlist.getPlaylists)
  // 歌单内歌曲
  router.get('/playlists/:id', cors, controllers.tracks.getTracks)
  router.get('/tracks/:id', controllers.tracks.getOne)
  router.get('/lyrics/:id', controllers.tracks.getLrc)
  router.get('/wechatlrc/:id', controllers.tracks.wechatlrc)
  router.get('/track/:id', controllers.tracks.mobilePage)

  router.get('/android/version', controllers.version.getAndroidVersion)
  router.get('/radio', controllers.tracks.radio)

  return router
}
