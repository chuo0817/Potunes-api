import * as Tracks from '../models/tracks'
import * as Articles from '../models/articles'

export function* fetchOld(next) {
	// 获取旧歌单
	const articles = yield Articles.fecthOldArticles()

	// 获取旧歌曲
	yield Tracks.fecthOldTracks(articles)

	// 匹配歌曲
	yield Tracks.match()

	this.redirect('/articles')
}
