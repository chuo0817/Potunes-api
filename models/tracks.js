import promisify from 'promisify-es6'
import * as Article from '../models/articles'
import * as pool from '../models/db'
import async from 'async'
import xml2js from 'xml2js-es6-promise'
import agent from 'superagent-es6-promise'

const series = promisify(async.series)


// 获取某篇文章下面的所有歌曲
export function *get(article_id) {
	const articleQuery = 'SELECT * FROM article_tracks where article_id = ?'
	const articleQuery_Params = [article_id]
	const trackIDs = []
	const result = yield pool.query(articleQuery, articleQuery_Params)
	const idQuery = 'SELECT * FROM tracks WHERE track_id = ?'
	for (let i = 0; i < result.length; i++) {
		const idParams = [result[i].track_id]
		trackIDs.push(Article.cr(idQuery, idParams))
	}
	return new Promise((resolve, reject) => {
		series(trackIDs)
		.then((results) => {
			const tracks = []
			for (let i = 0; i < results.length; i++) {
				tracks.push(results[i][0])
			}
			resolve(tracks)
		})
		.catch(err => {
			reject(err)
		})
	})
}

// 获取一首歌的信息
export function *getOne(track_id) {
	const trackQuery = 'SELECT * FROM tracks where track_id = ?'
	const trackQuery_params = [track_id]

	return new Promise((resolve, reject) => {
		pool.getConnection()
		.then(connection => {
			connection.query(trackQuery, trackQuery_params)
			.then(result => {
				resolve(result[0])
			})
		})
		.catch(err => {
			console.log(err)
			reject(err.message)
		})
	})
}

// 批量更新歌曲信息
export function *updateTracksInfo(body) {
	const updateQuery = 'UPDATE tracks SET track_artist = ?, track_name = ? WHERE track_id = ?'
	let ids = body.ids
	ids = ids.substr(1, ids.length - 2).split(',')
	const content = body.content
	xml2js(content)
	.then((js) => {
		const tracks = js.plist.dict[0].dict[0].dict
		const temp = []
		for (let i = 0; i < tracks.length; i++) {
			const track = tracks[i].string
			temp.push(track.slice(0, 2))
		}
		const tracksFunc = []
		for (let i = 0; i < ids.length; i++) {
			const artist = temp[i][1]
			const track_name = temp[i][0]
			const track_id = ids[i]
			const trackParams = [artist, track_name, track_id]
			tracksFunc.push(Article.cr(updateQuery, trackParams))
		}
		series(tracksFunc)
		.then((result) => {
			console.log('歌曲信息修改成功')
		})
		.catch((err) => {
			console.log(err)
		})
	})
}
// 更新一首歌信息
export function *updateTrack(body) {
	const updateQuery = `UPDATE tracks SET track_artist = ?,
	track_name = ?, track_cover = ?, track_url = ? WHERE track_id = ?`
	const trackParams = []
	for (let i = 1; i < body.length; i++) {
		trackParams.push(body[i].value)
	}
	trackParams.push(body[0].value)
	return new Promise((resolve, reject) => {
		pool.getConnection()
		.then(connection => {
			connection.query(updateQuery, trackParams)
			.then(result => {
				console.log(result)
				resolve(result)
			})
		})
		.catch(err => {
			console.log(err)
			reject(err.message)
		})
	})
}

// 删除一首歌的信息
export function *deleteTrack(body) {
	const deleteQuery = `DELETE tracks, article_tracks from tracks
											LEFT JOIN article_tracks
											ON tracks.track_id = article_tracks.track_id WHERE tracks.track_id= ?`
	const trackParams = [body.track_id]
	return new Promise((resolve, reject) => {
		pool.getConnection()
		.then(connection => {
			connection.query(deleteQuery, trackParams)
			.then(result => {
				console.log(result)
				resolve(result)
			})
		})
		.catch(err => {
			console.log(err)
			reject(err)
		})
	})
}

function cr(url) {
	return cb => {
		agent.get(url)
		.then(res => {
			cb(null, JSON.parse(res.text))
		})
		.catch(err => {
			cb(err)
		})
	}
}
// 抓取老数据库歌曲信息
export function* fecthOldTracks(articles) {
	const oldIdQuery = 'select * from articles order by article_id desc'
	const ids = []
	const tracks = []
	const result = yield pool.query(oldIdQuery)
	for (let i = 0; i < result.length; i++) {
		const mp3URL = `http://121.41.121.87:3000/api/v1/list-mp3s?id=${result[i].old_id}`
		ids.push(cr(mp3URL))
	}
	return new Promise((resolve, reject) => {
		series(ids)
		.then(res => {
			tracks.push(res)
			return tracks
		})
		.then((tracks) => {
			const tracksTemp = []
			const tracksQuery = `INSERT INTO tracks(track_artist,
				track_name, album, track_url, track_cover) VALUES(?,?,?,?,?)`

			for (let i = 0; i < tracks[0].length; i++) {
				const album = result[i].article_title
				for (let j = 0; j < tracks[0][i].length; j++) {
					const track = tracks[0][i][j]
					const tracksParams = [track.author, track.title, album, track.sourceUrl, track.thumb]
					tracksTemp.push(Article.cr(tracksQuery, tracksParams))
				}
			}
			series(tracksTemp)
			.then((res) => {
				resolve(res)
				console.log('旧歌曲已插入Tracks表')
			})
		})
		.catch(err => {
			reject(err)
		})
	})
}

export function* match(next) {
	const titleQuery = 'select distinct album from tracks'
	const idQuery = 'select article_id from articles'
	const titles = yield pool.query(titleQuery)
	const article_ids = yield pool.query(idQuery)
	const track_ids = []
	for (let i = 0; i < titles.length; i++) {
		const matchQuery = `select track_id from tracks where album = '${titles[i].album}'`
		const result = yield pool.query(matchQuery)
		track_ids.push(result)
	}
	for (let i = 0; i < article_ids.length; i++) {
		const insertQuery = 'insert into article_tracks(article_id) values(?)'
		const insertParam = [article_ids.reverse()[i].article_id]
		for (let j = 0; j < track_ids[i].length; j++) {
			yield pool.query(insertQuery, insertParam)
		}
	}
	return titles
}
