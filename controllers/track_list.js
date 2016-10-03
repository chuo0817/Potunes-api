import * as Tracks from '../models/tracks'

export function *getTracks(next) {
	const tracks = yield Tracks.get(this.query.id)
	yield this.render('track_list', {
		tracks,
		page_id: this.query.id,
	})
}

export function *updateTracks(next) {
	const tracks = yield Tracks.updateTrackInfo(this.request.body)
	yield this.render('track_list', {
		tracks,
	})
	// const content = yield Tracks.updateTrackInfo(this.request.body.content, 2)
	// const content = this.request.body.content
	// console.log(this.request.body)
}

export function *updateTrack(next) {
	console.log('进来啦')
	console.log(this.request.body)
	this.body='cheche'
}
