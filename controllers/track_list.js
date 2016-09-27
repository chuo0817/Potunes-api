import * as Tracks from '../models/tracks'
import * as Article from '../models/articles'
import convert from 'xml-js'

export function *getTracks(next) {
	const tracks = yield Tracks.get(this.query.id)
	yield this.render('track-list', {
		tracks,
		page_id: this.query.id,
	})
}

export function updateTracks(next) {
	const content = this.request.body.content
	const result = convert.xml2json(content)
	console.log(content.dict)
	return this.body = [result]
}
