var mysql = require('mysql')
  , Article = require('../models/articles.js')
  , async = require('async')
  , pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Potunes'
  });

export function *get(article_id) {
  var articleQuery = 'SELECT * FROM article_tracks where article_id = ?';
  var articleQuerry_Params = [article_id];
  var trackIDs = [];

  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err.message);
        return;
      }

    connection.query(articleQuery, articleQuerry_Params, function(err, result) {
        connection.release();

        var idQuery = 'SELECT * FROM tracks WHERE track_id = ?';
        for (var i = 0; i < result.length; i++) {
          var idParams = [result[i].track_id];
          trackIDs.push(Article.cr(idQuery, idParams));
        }

        async.series(trackIDs, function(err, result) {
          if (err) {
            console.log(err.message);
            return;
          }
          var tracks = [];
          for (var i = 0; i < result.length; i++) {
            var temp = result[i];
            tracks.push(temp[0]);
          }

          resolve(tracks);
        });
      });
    });
  });
}

export function updateTrackInfo(track_id, trackInfo) {
  var updateQuery = 'UPDATE tracks SET track_artist = ?, track_name = ? WHERE track_id = ?';
  var infos = trackInfo.split(' - ');
  var artist = infos[0];
  var name = infos[1];
  var updateParams = [artist, name, track_id];


}
