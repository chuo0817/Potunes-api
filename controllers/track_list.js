import * as Tracks from '../models/tracks'
import * as Article from '../models/articles'

export function *getTracks(next) {
	const tracks = yield Tracks.get(this.query.id)
	yield this.render('track-list', {
		tracks,
		page_id: this.query.id,
	})
}

export function updateTracks(next) {
	const content = this.request.body.content
	const ids = this.request.body.ids
	// 应判断content和ids的个数是否相同
	for (let i = 0; i < content.length; i++) {
		const infos = content[i].split(' - ')
	}
}
