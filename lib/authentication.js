export default function *(next) {
  if (!this.session || !this.session.user) {
    return this.redirect('/admin')
  }
  this.user = this.session.user
  return yield next
}
