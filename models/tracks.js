/* eslint global-require: "error" */
import mysql from 'promise-mysql'
import promisify from 'promisify-es6'
import * as Article from '../models/articles'
import async from 'async'
import xml2js from 'xml2js-es6-promise'
import agent from 'superagent-es6-promise'

const series = promisify(async.series)
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Potunes',
})

// 获取某篇文章下面的所有歌曲
export function *get(article_id) {
	const articleQuery = 'SELECT * FROM article_tracks where article_id = ?'
	const articleQuery_Params = [article_id]
	const trackIDs = []

	return new Promise((resolve, reject) => {
		pool.getConnection()
		.then((connection) => {
			connection.query(articleQuery, articleQuery_Params)
			.then((result) => {
				pool.releaseConnection(connection)
				const idQuery = 'SELECT * FROM tracks WHERE track_id = ?'
				for (let i = 0; i < result.length; i++) {
					const idParams = [result[i].track_id]
					trackIDs.push(Article.cr(idQuery, idParams))
				}

				series(trackIDs)
				.then((results) => {
					const tracks = []
					for (let i = 0; i < results.length; i++) {
						tracks.push(results[i][0])
					}
					resolve(tracks)
				})
			})
		})
		.catch((err) => {
			console.log(err)
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

// 抓取老数据库歌曲信息
export function* fecthOld(next) {
	const URL = 'http://121.41.121.87:3000/api/v1/lists'
	const articles = []
	return new Promise((resolve, reject) => {
		agent.get(URL)
		.then(res => {
			const result = JSON.parse(res.text).reverse()
			for (let i = 0; i < result.length; i++) {
				const article = {}
				const temp = result[i]
				article.title = temp.title
				article.type = temp.category
				article.content = temp.content
				article.prefixUrl = temp.coverImage.substr(0, temp.coverImage.length - 9)
				article.id = temp.id
				articles.push(article)
			}
			resolve(articles)
		})
		.catch(err => {
			reject(err)
		})
	})
}

function cr(url) {
	return cb => {
		agent.get(url)
		.then(res => {
			// console.log(JSON.parse(res.text).length)
			cb(null, JSON.parse(res.text))
		})
		.catch(err => {
			cb(err)
		})
	}
}

// 抓老歌曲信息
export function* fecthOldTracks(articles) {
	const ids = []
	for (let i = 0; i < articles.length; i++) {
		const mp3URL = `http://121.41.121.87:3000/api/v1/list-mp3s?id=${articles[i].id}`
		ids.push(cr(mp3URL))
	}
	const tracks = []
	return new Promise((resolve, reject) => {
		series(ids)
		.then(res => {
			tracks.push(res)
		})
		.then(res => {
			resolve(tracks[0])
		})
		.catch(err => {
			console.log(err.message)
		})
	})
}


export function *macthOldMusicInfo(tracks) {
	const tracksFunc = []
	for (let i = 0; i < tracks.length; i++) {
		const article_tracks = tracks[i]
		const articleQuery = `SELECT * from article_tracks where article_id = ${i+1}`
		pool.getConnection()
		.then((connection) => {
			connection.query(articleQuery)
			.then((result) => {
				pool.releaseConnection(connection)
				const updateQuery = 'UPDATE tracks SET track_artist = ?, track_name = ? WHERE track_id = ?'

				for (let j = 0; j < result.length; j++) {
					tracksFunc.push(Article.cr(updateQuery, [article_tracks[j].author, article_tracks[j].title, result[j].track_id]))
					console.log(article_tracks[j].author)
				}

			})
		})
		.catch((err) => {
			console.log(err)
		})
	}

}
