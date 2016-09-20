'use strict';

var parser = require('co-body')
  , User = require('../models/user.js')
  , Articles = require('../models/articles');

//首页
export function *home(next) {
  yield this.render('admin', {
    title: '后台'
  });
}
//管理员登录
export function *adminLogin(next) {
  var body = this.request.body;

  if (!body.name || !body.password) {
    return this.body = {
      status: 400,
      message: '{name} & {password} is required.'
    }
  }

  var user = yield User.get(body.name);

  console.log(user.name);
  // this.session.user = user;
  this.redirect('/articles');
}

//获取文章列表
export function *articles(next) {
  var articles = yield Articles.getAll();
  yield this.render('index', {
    title: '歌单',
    articles: articles
  });
}
