import mysql from 'promise-mysql'
import promisify from 'promisify-es6'
import async from 'async'
import agent from 'superagent-es6-promise'

const series = promisify(async.series)
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Potunes',
})

// 获取所有的文章
export function getAll() {
	const articleQuery = 'SELECT * FROM articles order by article_id desc'
	return new Promise((resolve, reject) => {
		pool.query(articleQuery)
		.then((rows) => {
			resolve(rows)
		})
		.catch((err) => {
			reject(err)
		})
	})
}
// 获取单个文章列表
export function getOne() {

}

export function cr(query, params) {
	return (cb) => {
		pool.getConnection()
		.then((connection) => {
			connection.query(query, params)
			.then((result) => {
				pool.releaseConnection(connection)
				cb(null, result)
			})
		})
		.catch((err) => {
			console.log(err.message)
			cb(err)
		})
	}
}

// 保存文章
export function save(article) {
	const preURL = article.prefixUrl
	// 新增文章
	const articleQuery = `INSERT INTO articles(article_title, article_type,
              article_content, article_cover, article_songs) VALUES(?,?,?,?,?)`
	const articleCoverURL = `${preURL}cover.png`
	const articleParams = [
		article.title,
		article.type,
		article.content,
		articleCoverURL,
		article.songCount,
	]


	pool.getConnection()
	.then((connection) => {
		connection.query(articleQuery, articleParams)
		.then((result) => {
			pool.releaseConnection(connection)
			const insertID = result.insertId
			console.log('文章新增成功')
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
				const trackParams = ['unwritten', 'unwritten', 'unwritten', 'unwritten']
				trackParams.push(track_url, track_cover)
				tracksFunc.push(cr(tracksQuery, trackParams))
			}

			series(tracksFunc)
			.then(() => {
				const idQuery = 'SELECT * FROM articles where article_id = ?'
				const idParam = [insertID]
				pool.getConnection()
				.then((conn) => {
					connection.query(idQuery, idParam)
					.then((results) => {
						pool.releaseConnection(conn)
						const relationParams = [results[0].article_id]

						for (let i = 0; i < article.songCount; i++) {
							relationFunc.push(cr(relationQuery, relationParams))
						}
						series(relationFunc)
						.then((res) => {
							console.log('歌曲新增成功')
						})
					})
				})
			})
		})
	})
	.catch((err) => {
		console.log(err.message)
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
						article_content, article_cover, old_id) VALUES(?,?,?,?,?)`
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
				]
				articlesTemp.push(cr(articleQuery, articleParams))
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
