import mysql from 'promise-mysql'
import promisify from 'promisify-es6'
import * as Article from '../models/articles.js'
import async from 'async'

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

export function updateTrackInfo(track_id, trackInfo) {
	const updateQuery = 'UPDATE tracks SET track_artist = ?, track_name = ? WHERE track_id = ?'
	const infos = trackInfo.split(' - ')
	const artist = infos[0]
	const name = infos[1]
	const updateParams = [artist, name, track_id]
}
