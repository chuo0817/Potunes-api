import promisify from 'promisify-es6'
import async from 'async'
import agent from 'superagent-es6-promise'
import * as pool from '../models/db'
import marked from 'marked'

const series = promisify(async.series)


// 获取所有的文章
export function *getAll() {
  const articleQuery = 'SELECT * FROM articles order by article_id desc'
  const articles = yield pool.query(articleQuery)
  return articles
}

export function* getAllByMobile() {
  const articleQuery = `SELECT article_id,article_title,article_cover FROM articles order by article_id desc`
  const articles = yield pool.query(articleQuery)
  return articles
}
// 获取单个文章列表
export function getOne() {

}

// 保存文章
export function *save(article) {
  const preURL = article.prefixUrl
  // 新增文章
  const articleQuery = `INSERT INTO articles(article_title, article_type,
              article_content, article_cover, article_songs) VALUES(?,?,?,?,?)`
  const articleCoverURL = `${preURL}cover.png`
  const articleParams = [
    article.title,
    article.type,
    marked(article.content),
    articleCoverURL,
    article.songCount,
  ]

  const result = yield pool.query(articleQuery, articleParams)
  const insertID = result.insertId
  const tracksFunc = []
  const relationFunc = []
  const tracksQuery = `INSERT INTO tracks (
                    track_name,
                    track_artist,
                    track_lrc,
                    track_lrc_cn,
                    track_url,
                    track_cover) VALUE(?,?,?,?,?,?)`
  const relationQuery = 'INSERT INTO article_tracks(article_id) VALUE(?)'

  for (let i = 0; i < article.songCount; i++) {
    let track_url = ''
    let track_cover = ''
    const t = i + 1
    if (t < 10) {
      track_url = `${preURL}0${t}.mp3`
      track_cover = `${preURL}0${t}.jpg`
    }

    if (t >= 10) {
      track_url = `${preURL}${t}.mp3`
      track_cover = `${preURL}${t}.jpg`
    }
    if (article.type === '1') {
      track_cover = `${preURL}cover.jpg`
    }
    const trackParams = ['unwritten', 'unwritten', 'unwritten', 'unwritten']
    trackParams.push(track_url, track_cover)
    tracksFunc.push(pool.cr(tracksQuery, trackParams))
  }
  const idQuery = 'SELECT * FROM articles where article_id = ?'
  const idParam = [insertID]
  const results = yield pool.query(idQuery, idParam)

  series(tracksFunc)
  .then(() => {
    const relationParams = [results[0].article_id]

    for (let i = 0; i < article.songCount; i++) {
      relationFunc.push(pool.cr(relationQuery, relationParams))
    }
    series(relationFunc)
    .then((res) => {
      console.log('歌曲新增成功')
    })
  })
}

// 获取旧歌单
export function* fecthOldArticles(next) {
  const URL = 'http://121.41.121.87:3000/api/v1/lists'
  return new Promise((resolve, reject) => {
    agent.get(URL)
    .then(res => {
      // 获取全部旧歌单
      const result = JSON.parse(res.text).reverse()
      const articlesTemp = []
      const articleQuery = `INSERT INTO articles(article_title, article_type,
      			article_content, article_cover, old_id, is_ready) VALUES(?,?,?,?,?,?)`
      for (let i = 0; i < result.length; i++) {
        const article = {}
        const temp = result[i]
        article.prefixUrl = temp.coverImage.substr(0, temp.coverImage.length - 9)
        const cover = `${article.prefixUrl}cover.png`
        const articleParams = [
          temp.title,
          temp.category,
          temp.content,
          cover,
          temp.id,
          1,
        ]
        articlesTemp.push(pool.cr(articleQuery, articleParams))
      }
      series(articlesTemp)
      .then(() => {
        resolve(getAll())
      })
      .catch(err => {
        reject(err)
      })
    })
  })
}

export function* getMaxId(next) {
  const query = 'select max(article_id) as id from articles'
  const max = yield pool.query(query)
  return max[0].id
}
