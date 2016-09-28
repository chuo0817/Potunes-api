import * as Tracks from '../models/tracks'
import * as Article from '../models/articles'
const xml2js = require('xml2js-es6-promise')


export function *getTracks(next) {
	const tracks = yield Tracks.get(this.query.id)
	yield this.render('track-list', {
		tracks,
		page_id: this.query.id,
	})
}

export function updateTracks(next) {
	const content = this.request.body.content
	console.log(content)
	xml2js(content).then((js) => {
		const tracks = js.plist.dict[0].dict[0].dict
		const temp = []
		for (let i = 0; i < tracks.length; i++) {
			const track = tracks[i].string
			temp.push(track.slice(0, 2))
		}
		return this.body = temp
	})
}
