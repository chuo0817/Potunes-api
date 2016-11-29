import request from 'request'
import * as pool from '../models/db'

export function *parse(next) {
  const url = 'http://lastshrek.b0.upaiyun.com/2016/01/011.lrc'
  const tracksQuery = 'select * from tracks'
  const tracks = yield pool.query(tracksQuery)
  for (let i = 0; i < tracks.length; i++) {
    console.log(tracks[i].url)
  }
  return new Promise((resolve, reject) => {
    request({ url, encoding: 'utf8' }, (err, r, data) => {
      if (data.indexOf('404')) {
        console.log('没有歌词')
      }
      console.log(data)
      resolve(data)
    })
  })
}
