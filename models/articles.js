import mysql from 'promise-mysql'
import async from 'async'

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
			connection.release()
			console.log('文章新增成功')
		})
	})
	.catch((err) => {
		console.log(err.message)
	})

	// 新增歌曲
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
	async.series(tracksFunc, (err, result) => {
		if (result) {
			console.log('进1')
			const idQuery = 'SELECT * FROM articles order by article_id desc'
			pool.getConnection()
			.then((connection) => {
				connection.query(idQuery)
				.then((results) => {
					const relationParams = [results[0].article_id]
					console.log(relationParams)
					for (let i = 0; i < article.songCount; i++) {
						relationFunc.push(cr(relationQuery, relationParams))
					}
					console.log('*******')
					console.log(relationFunc)
					async.waterfall(relationFunc)
					.then((res) => {
						console.log('歌曲存储成功')
					})
				})
			})
			.catch((err) => {
				console.log(err.message)
			})
		}
	})
}
