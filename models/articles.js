'use strict';
var mysql = require('mysql')
  , async = require('async')
  , pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Potunes'
  });

//获取所有的文章
export function getAll() {
  var articleQuery = 'SELECT * FROM articles order by article_id desc';

  return new Promise(function (resolve, reject) {
    pool.getConnection(function(err, connection) {
      if (err) return reject(err);

      connection.query(articleQuery, function(err, result) {
        connection.release();

        if (err) return reject(err);

        resolve(result);
      });
    });
  });
}
//获取单个文章列表
export function getOne() {

}

//保存文章
export function save(article) {
  var preURL = article.prefixUrl;
  //新增文章
  var articleQuery = `INSERT INTO articles(article_title, article_type,
              article_content, article_cover, article_songs) VALUES(?,?,?,?,?)`;
  var articleCoverURL = preURL + 'cover.png';
  var articleParams = [article.title, article.type, article.content, articleCoverURL, article.songCount];

  pool.getConnection(function(err, connection) {
    if (err) console.log(err.message);

    connection.query(articleQuery, articleParams, function(err, result) {
      connection.release();
      if(err) console.log(err.message);
    });
  });

  //新增歌曲
  var tracksFunc = [], relationFunc = [];
  var tracksQuery = `INSERT INTO tracks (track_name, track_artist, track_lrc,
                    track_lrc_cn, track_url, track_cover) VALUE(?,?,?,?,?,?)`;
  var relationQuery = 'INSERT INTO article_tracks(article_id) VALUE(?)';



  for(let i = 0; i < article.songCount; i++) {
    var track_url = '', track_cover = '';
    var t = i + 1;
    if(t < 10) {
      track_url = preURL + '0' + t + '.mp3';
      track_cover = preURL + '0' + t + '.jpg';
    }

    if(t >= 10) {
      track_url = preURL + t + '.mp3';
      track_cover = preURL + t + '.jpg';
    }
    let trackParams = ['unwritten', 'unwritten', 'unwritten', 'unwritten'];
    trackParams.push(track_url, track_cover);

    // let relationParams = [article.id, t];


    tracksFunc.push(cr(tracksQuery, trackParams));
  }

  async.series(tracksFunc, function(err,result) {
    if(result) {

      var idQuery = 'SELECT * FROM articles order by article_id desc';
      var idParams = [article.title];
      pool.getConnection(function(err, connection) {
        if(err) {
           console.log(err.message);
           return;
        };
        connection.query(idQuery, function(err, result) {
          connection.release();
          if (err) {
            console.log(err.message);
            return;
          }
          if (result) {
            var relationParams = [result[0].article_id];

            for (var i = 0; i < article.songCount; i++) {
              relationFunc.push(cr(relationQuery, relationParams));
            }
            async.series(relationFunc, function(err, result) {
              if (err) {
                console.log(err.message);
                return;
              }
            });
          }
        });
      });
    }
  });
}

export function cr(query, params){
  return function(callback){
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err.message);
        callback(err);
        return;
      }

      connection.query(query, params, function(err, result) {
        if(err) console.log(err.message);
        connection.release();
        // console.log(result);
        callback(null, result);
      });
    });
  }
}
