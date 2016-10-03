import mysql from 'promise-mysql'
import promisify from 'promisify-es6'
import * as Article from '../models/articles'
import async from 'async'
import xml2js from 'xml2js-es6-promise'

const series = promisify(async.series)
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Potunes',
})


export function *get(article_id) {
	const articleQuery = 'SELECT * FROM article_tracks where article_id = ?'
	const articleQuerry_Params = [article_id]
	const trackIDs = []

	return new Promise((resolve, reject) => {
		pool.getConnection()
		.then((connection) => {
			connection.query(articleQuery, articleQuerry_Params)
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

export function *updateTrackInfo(body) {
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
