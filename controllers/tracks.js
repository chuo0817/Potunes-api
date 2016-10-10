import * as Tracks from '../models/tracks'
import * as Articles from '../models/articles'

export function* fetchOld(next) {
	// 获取旧歌单
	const articles = yield Articles.fecthOldArticles()
		// const articles = yield Articles.getAll()

	// 获取旧歌曲
	const tracks = yield Tracks.fecthOldTracks(articles).next()

	// 匹配歌曲
	yield Tracks.match().next()

	this.body = tracks
}
