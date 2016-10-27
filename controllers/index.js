export function* home(next) {
  this.render('home', {
    title: '首页',
  })
}

export function* direct(next) {
  this.redirect('/api/admin/')
}
