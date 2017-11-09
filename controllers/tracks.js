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
export function* wechatlrc(next) {
  const lrc = yield Tracks.getLrc(this.params.id)
  this.body = [lrc]
}

export function* create(next) {
  console.log(this.request.body)
  yield Tracks.add(this.request.body)
  this.redirect('/api/admin/tracks/add')
}


export function* add(next) {
  this.render('add_track', {
    title: '添加单曲',
    header: 'playlists',
  })
  return null
}

export function* radio(next) {
  const track = yield Tracks.radio()
  this.body = track
}

export function* mobilePage(next) {
  const track = yield Tracks.getOne(this.params.id)
  console.log(track)
  this.render('mobile_page', {
    track,
  })
  return null
}
