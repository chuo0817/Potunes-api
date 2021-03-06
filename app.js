import Koa from 'koa'
import logger from 'koa-logger'
import json from 'koa-json'
import views from 'koa-views'
// import routers from './routers'
import parser from 'koa-bodyparser'
import Debug from 'debug'
import Pug from 'koa-pug'
import serve from 'koa-static'
import session from 'koa-generic-session'
import MysqlStore from 'koa-mysql-session'
import _requiredir from 'require-dir'
const routers = _requiredir('./routers')

const debug = new Debug('app:index:')
const app = new Koa()


// const config = {
//   user: 'root',
//   password: 'Purchasr7',
//   database: 'Potunes',
//   host: 'mysql',
// }
const config = {
  user: 'root',
  password: 'Purchasr7',
  database: 'Potunes',
  host: '112.124.36.151',
}

const pug = new Pug({
  viewPath: `${__dirname}/views/`,
  debug: false,
  pretty: false,
  compileDebug: false,
  app,
})

app.use(function* error(next) {
  try {
    yield next
  } catch (err) {
    debug('app error: ', err.status, ',', err.message, ',', err.stack)
  }
})

app.keys = ['pengcheng', 'poche']

app.use(session({
  prefix: 'poche:',
  store: new MysqlStore(config),
  cookie: {
    maxage: null,
    path: '/',
    httpOnly: true,
    rewrite: true,
    signed: true,
  },
}))

app.use(parser({ extended: true }))

app.use(json())
app.use(logger())

app.use(views(`${__dirname}/views/`, {
  map: {
    html: 'pug',
  },
}))
app.use(serve(`${__dirname}/public`))
app.use(routers.backend().routes())
app.use(routers.frontend().routes())
app.use(routers.mobile().routes())

module.exports = app
