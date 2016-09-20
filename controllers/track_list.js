'use strict';

var parser = require('co-body')
  , Tracks = require('../models/tracks.js')
  , Article = require('../models/articles.js');

export function *getTracks(next) {
  var tracks = yield Tracks.get(this.query.id);
  yield this.render('track-list', {
    tracks : tracks,
    page_id : this.query.id
  });
}

export function updateTracks(next) {
  var content = this.request.body.content;
  var ids = this.request.body.ids;
  //应判断content和ids的个数是否相同
  for (var i = 0; i < content.length; i++) {
    var infos = content[i].split(' - ');

  }
}
