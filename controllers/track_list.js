import * as Tracks from '../models/tracks'
import * as Article from '../models/articles'
const xml2js = require('xml2js-es6-promise')
import parser from 'koa-bodyparser'


export function *getTracks(next) {
	const tracks = yield Tracks.get(this.query.id)
	yield this.render('track_list', {
		tracks,
		page_id: this.query.id,
	})
}

export function *updateTracks(next) {
	console.log(this.request.body)
	// const content = yield Tracks.updateTrackInfo(this.request.body.content, 2)
	// const content = this.request.body.content
	// console.log(this.request.body)
	// xml2js(content)
	// .then((js) => {
	// 	const tracks = js.plist.dict[0].dict[0].dict
	// 	const temp = []
	// 	for (let i = 0; i < tracks.length; i++) {
	// 		const track = tracks[i].string
	// 		temp.push(track.slice(0, 2))
	// 	}
	// 	return this.body = temp
	// })
}
