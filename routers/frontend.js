import Router from 'koa-router'
import _requiredir from 'require-dir'

const controllers = _requiredir('../controllers')

export default function() {
  const router = new Router({
    // prefix: '/api/admin',
  })

  // 首页
  router.get('/', controllers.index.home)
  router.get('/poche', controllers.index.direct)
  return router
}
