import mysql from 'mysql'
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
		pool.getConnection((err, connection) => {
			if (err) return reject(err)

			connection.query(articleQuery, (error, result) => {
				connection.release()

				if (error) return reject(error)
				resolve(result)
				return null
			})
			return null
		})
	})
}
// 获取单个文章列表
export function getOne() {

}

function cr(query, params){
  return function(callback){
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err.message);
        callback(err);
        return;
      }

      connection.query(query, params, function(err, result) {
        if(err) console.log(err.message);
        connection.release();
        // console.log(result);
        callback(null, result);
      });
    });
  }
}

// 保存文章
export function save(article) {
	const preURL = article.prefixUrl
	// 新增文章
	const articleQuery = `INSERT INTO articles(article_title, article_type,
              article_content, article_cover, article_songs) VALUES(?,?,?,?,?)`
	const articleCoverURL = `${preURL},cover.png`
	const articleParams = [
		article.title,
		article.type,
		article.content,
		articleCoverURL,
		article.songCount,
	]

	pool.getConnection((err, connection) => {
		if (err) console.log(err.message)

		connection.query(articleQuery, articleParams, (error, result) => {
			connection.release()
			if (error) console.log(err.message)
		})
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
			track_url = `${preURL},0,${t},.mp3`
			track_cover = `${preURL},0,${t},.jpg`
		}

		if (t >= 10) {
			track_url = `${preURL},${t},.mp3`
			track_cover = `${preURL},${t},.jpg`
		}
		const trackParams = ['unwritten', 'unwritten', 'unwritten', 'unwritten']
		trackParams.push(track_url, track_cover)

		// let relationParams = [article.id, t];


		tracksFunc.push(cr(tracksQuery, trackParams))
	}

	async.series(tracksFunc, (err, result) => {
		if (result) {
			const idQuery = 'SELECT * FROM articles order by article_id desc'
			const idParams = [article.title]
			pool.getConnection((error, connection) => {
				if (err) {
					console.log(err.message)
					return
				}
				connection.query(idQuery, (err, results) => {
					connection.release()
					if (err) {
						console.log(err.message)
						return
					}
					if (results) {
						const relationParams = [results[0].article_id]

						for (let i = 0; i < article.songCount; i++) {
							relationFunc.push(cr(relationQuery, relationParams))
						}
						async.series(relationFunc, (err, res) => {
							if (err) {
								console.log(err.message)
								return
							}
						})
					}
				})
			})
		}
	})
}
