'use strict';

var Router = require('koa-router')
  , _requiredir = require('require-dir');

const controllers = _requiredir('./controllers');

module.exports = function() {
  const router = Router();

  router.get('/', function *(next){
    this.body = 'Hello World.';
  });

  router.get('/adminCenter', controllers.index.home);
  router.post('/adminCenter', controllers.index.adminLogin);

  router.get('/articles', controllers.index.articles);

  router.get('/newArticle', controllers.newArticle.home);
  router.post('/newArticle', controllers.newArticle.post);

  router.get('/track-list', controllers.track_list.getTracks);
  router.post('/track-list', controllers.track_list.updateTracks);

  return router;
}
