import Router from 'koa-router'
import _requiredir from 'require-dir'

const controllers = _requiredir('../controllers')

export default function() {
  const router = new Router()
  // 首页
  router.get('/', controllers.index.home)
  router.get('/poche', controllers.index.direct)
  // mobile
  // 获取文章列表
  return router
}
