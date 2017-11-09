window.onload = function() {
  ~ function() {
    function $(obj) {
      return document.getElementById(obj)
    }
    const myPlayer = $('player')
    let index = 0
    let data = null
    const EventUtil = {
      addHandler: (el, type, handler) => {
        if (el.addEventListener) {
          el.addEventListener(type, handler, false)
        } else if (el.attachEvent) {
          el.attachEvent('on${type}', handler)
        } else {
          el['on${type}' + type] = handler
        }
      },
      removeHandler: (el, type, handler) => {
        if (el.removeEventListener) {
          el.removeEventListener(type, handler)
        } else if (el.detachEvent) {
          el.detachEvent(type, handler)
        } else {
          el[`on${type}`] = null
        }
      },
      getEvent: (e) => {
        return e ? e : window.event
      },
      getTarget: (e) => {
        return e.target || e.srcElement
      }
    }

		// 控制播放或暂停
    EventUtil.addHandler($('playOrpause'), 'click', () => {
      if (myPlayer.paused) {
        myPlayer.play()
        $('playpause').innerText = 'pause'
        return
      }
      myPlayer.pause()
      $('playpause').innerText = 'play_arrow'
    })

    // 数据绑定
    // 控制进度条面板
    let timer = null
    const progress_inner = document.querySelector('.determinate')
    function musicControl() {
      progress_inner.style.width = 1
    }


    function controlProgress() {
      if (!myPlayer.paused) {
        $('playpause').innerText = 'pause'
      }
      let percent_played = myPlayer.currentTime / myPlayer.duration * 100
      progress_inner.style.width = `${percent_played}%`
      EventUtil.addHandler(progress_inner.parentNode, 'click', (e) => {
        clearInterval(timer)
        e = e || window.event
        const disX = e.clientX - this.offsetLeft
        percent_played = disX / this.offsetWidth
        progress_inner.style.width = `${percent_played}%`
        myPlayer.currentTime = parseInt(percent_played * myPlayer.duration, 0)
      })
    }
    timer = window.setInterval(() => {
      controlProgress()
    }, 1000)

    function init() {
      musicControl()
    }
    init()
  }()
}
