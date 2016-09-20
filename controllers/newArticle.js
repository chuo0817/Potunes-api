'use strict';
var parser = require('co-body')
  , User = require('../models/user.js')
  , Articles = require('../models/articles');

export function *home(next) {
  yield this.render('newArticle', {
    title : '新增文章'
  });
}

export function *post(next) {
  var body = this.request.body;

  Articles.save(body);

  this.redirect('/articles');
}
