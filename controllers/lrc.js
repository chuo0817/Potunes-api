import * as lrcs from '../models/lrc'


export function* fecth(next) {
  const lrc = yield lrcs.parse()
  this.body = lrc
}
