import * as Tracks from '../models/tracks'
import * as Articles from '../models/articles'

export function* fetchOld(next) {
	const articles = yield Tracks.fecthOld()
	// const tracks = yield Tracks.fecthOldTracks(articles)
	// for (let i = 0; i < tracks.length; i++) {
	// 	articles[i].songCount = tracks[i].length
	// }
	// yield Articles.saveOld(articles)
	// yield this.redirect('/articles')
	// yield Tracks.macthOldMusicInfo(tracks)
	this.body = articles
}
