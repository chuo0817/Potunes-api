import * as Tracks from '../models/tracks'
import * as Playlists from '../models/playlists'

export function* getTracks(next) {
  const tracks = yield Tracks.getTracksByMobile(this.params.id)
  this.body = tracks
}

export function* getOne(next) {
  const track = yield Tracks.getOne(this.params.id)
  this.body = track
}

export function* getLrc(next) {
  const lrc = yield Tracks.getLrc(this.params.id)
  this.body = lrc
}

export function* create(next) {
  const track = yield Tracks.create(this.request.body)
  this.body = track
}

export function* wechatlrc(next) {
  const lrc = yield Tracks.getLrc(this.params.id)
  this.body = [lrc]
}
