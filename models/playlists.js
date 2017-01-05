import promisify from 'promisify-es6'
import async from 'async'
import agent from 'superagent-es6-promise'
import * as pool from '../models/db'
import marked from 'marked'

const series = promisify(async.series)


// 获取所有的文章
export function *getAll() {
  const playlistQuery = 'SELECT * FROM playlists where is_ready = 1 order by id desc'
  const playlists = yield pool.query(playlistQuery)
  return playlists
}
// 客户端返回列表
export function* getAllByMobile() {
  const playlistQuery = 'SELECT id,title,cover FROM playlists where is_ready = 1 && id <> 35 && id <> 34 && id <> 33 order by id desc'
  const playlists = yield pool.query(playlistQuery)
  return playlists
}
// 假数据
export function* getFake() {
  const playlistQuery = 'SELECT id,title,cover FROM playlists where fake = 1 order by id desc'
  const playlists = yield pool.query(playlistQuery)
  return playlists
}
// 获取单个文章列表
export function* getOne(id) {
  const playlistQuery = 'select * from playlists where id = ?'
  const parmas = [id]
  const playlists = yield pool.query(playlistQuery, parmas)
  return playlists[0]
}

// 保存文章
export function *save(playlist) {
  const preURL = playlist.prefixUrl
  // 新增文章
  const playlistQuery = `INSERT INTO playlists(title, type,
              content, cover, songs) VALUES(?,?,?,?,?)`
  const playlistCoverURL = `${preURL}cover.png`
  const playlistParams = [
    playlist.title,
    playlist.type,
    marked(playlist.content),
    playlistCoverURL,
    playlist.songCount,
  ]

  const result = yield pool.query(playlistQuery, playlistParams)
  const insertID = result.insertId
  const tracksFunc = []
  const relationFunc = []
  const tracksQuery = `INSERT INTO tracks (
                    name,
                    artist,
                    lrc,
                    lrc_cn,
                    url,
                    cover) VALUE(?,?,?,?,?,?)`
  const relationQuery = 'INSERT INTO playlist_tracks(playlist_id) VALUE(?)'

  for (let i = 0; i < playlist.songCount; i++) {
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
    if (playlist.type === '1') {
      track_cover = `${preURL}cover.jpg`
    }
    const trackParams = ['unwritten', 'unwritten', 'unwritten', 'unwritten']
    trackParams.push(track_url, track_cover)
    tracksFunc.push(pool.cr(tracksQuery, trackParams))
  }
  const idQuery = 'SELECT * FROM playlists where id = ?'
  const idParam = [insertID]
  const results = yield pool.query(idQuery, idParam)
  return new Promise((resolve, reject) => {
    series(tracksFunc)
    .then(() => {
      const relationParams = [results[0].id]

      for (let i = 0; i < playlist.songCount; i++) {
        relationFunc.push(pool.cr(relationQuery, relationParams))
      }
      series(relationFunc)
      .then((res) => {
        resolve(insertID)
      })
    })
    .catch(err => {
      reject(err)
    })
  })
}

export function* getMaxId(next) {
  const query = 'select max(id) as id from playlists'
  const max = yield pool.query(query)
  return max[0].id
}

export function* getDrafts(next) {
  const query = 'SELECT * FROM playlists where is_ready = 0 order by id desc'
  const drafts = yield pool.query(query)
  return drafts
}

export function* ready(id) {
  const query = 'UPDATE playlists SET is_ready = 1 WHERE id = ?'
  const params = [id]
  yield pool.query(query, params)
  return null
}

export function* del(id) {
  const tracksQuery = 'select * from playlist_tracks where playlist_id = ?'
  const trackParams = [id]
  const result = yield pool.query(tracksQuery, trackParams)
  const playlistQuery = 'DELETE playlists, playlist_tracks from playlists LEFT JOIN playlist_tracks ON playlists.id = playlist_tracks.playlist_id WHERE playlists.id= ?'
  yield pool.query(playlistQuery, trackParams)
  const delTrackQuery = 'delete from tracks where id = ?'
  const tracks = []
  for (let i = 0; i < result.length; i++) {
    const param = [result[i].track_id]
    tracks.push(pool.cr(delTrackQuery, param))
  }
  return new Promise((resolve, reject) => {
    series(tracks)
    .then(() => {
      resolve('success')
    })
    .catch(err => {
      reject(err)
    })
  })
}
