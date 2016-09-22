import mysql from 'mysql'
import * as Article from '../models/articles.js'
import async from 'async'

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
		pool.getConnection((err, connection) => {
			if (err) {
				reject(err.message)
				return
			}

			connection.query(articleQuery, articleQuerry_Params, (error, result) => {
				connection.release()
				const idQuery = 'SELECT * FROM tracks WHERE track_id = ?'
				for (let i = 0; i < result.length; i++) {
					const idParams = [result[i].track_id]
					trackIDs.push(Article.cr(idQuery, idParams))
				}
				// console.log(trackIDs)
				async.series(trackIDs, (errors, results) => {
					if (errors) {
						console.log(errors.message)
						return
					}
					const tracks = []
					for (let i = 0; i < results.length; i++) {
						// const temp = result[i]
						// console.log(temp.track_id)
						tracks.push(results[i][0])
					}
					resolve(tracks)
				})
			})
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
