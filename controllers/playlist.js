import * as Playlists from '../models/playlists'
import * as Tracks from '../models/tracks'

export function* get(next) {
  if (this.params.id) {
    const tracks = yield Tracks.get(this.params.id)
    this.render('track_list', {
      tracks,
      title: '歌单',
      header: 'Playlist',
      page_id: this.params.id,
    })
    return null
  }
  const playlists = yield Playlists.getAll()
  this.render('admin_index', {
    title: '管理员首页',
    header: 'AdminHome',
    playlists,
  })
  return null
}

export function *edit(next) {
  this.render('new_playlist', {
    title: '新增文章',
    header: '新建',
    button: '走你',
  })
  return null
}


export function *create(next) {
  const body = this.request.body
  const p_id = yield Playlists.save(body)
  this.redirect(`/api/admin/playlists/${p_id}`)
}


export function* getPlaylists(next) {
  if (this.query.v == '1.2.8' || (this.query.v == 'mina' && this.query.id == '1.0.1')) {
    // return fake data
    const fakeLists = yield Playlists.getFake()
    return this.body = fakeLists
  }
  const playlists = yield Playlists.getAllByMobile()
  return this.body = playlists
}

export function* draft(next) {
  const playlists = yield Playlists.getDrafts()
  this.render('admin_index', {
    title: '草稿箱',
    header: 'playlists',
    playlists,
  })
  return null
}

export function* ready(next) {
  yield Playlists.ready(this.request.body.playlist_id)
  return this.body = 'done'
}

export function* del(next) {
  yield Playlists.del(this.params.id)
  return this.body = 'done'
}

export function* purchas_listening(next) {
  const tracks = yield Playlists.getNowListening()
  this.render('track_list', {
    title: '破车正在听',
    tracks,
  })
}
