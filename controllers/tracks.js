import * as Tracks from '../models/tracks'
import * as Playlists from '../models/playlists'

export function* fetchOld(next) {
  // 获取旧歌单
  const playlists = yield Playlists.fecthOldPlaylists()
  // 获取旧歌曲
  yield Tracks.fecthOldTracks(playlists)
  // 匹配歌曲
  yield Tracks.match()
  this.redirect('/api/admin/playlists')
}

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
