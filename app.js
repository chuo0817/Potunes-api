import Koa from 'koa'
import logger from 'koa-logger'
import json from 'koa-json'
import views from 'koa-views'
import routers from './routers'
import parser from 'koa-bodyparser'
import Debug from 'debug'
import Pug from 'koa-pug'
import serve from 'koa-static'

const debug = new Debug('app:index:')

const app = new Koa()
const pug = new Pug({
	viewPath: `${__dirname}/views`,
	debug: false,
	pretty: false,
	compileDebug: false,
	app,
})

pug.locals.someKey = 'some value'


app.use(function* error(next) {
	try {
		yield next
	} catch (err) {
		debug('app error: ', err.status, ',', err.message, ',', err.stack)
	}
})
app.use(parser({ extended: true }))
app.use(json())
app.use(logger())

app.use(views(`${__dirname}/views`, {
	map: {
		html: 'pug',
	},
}))
app.use(serve(`${__dirname}/public`))
app.use(routers().routes())

module.exports = app
