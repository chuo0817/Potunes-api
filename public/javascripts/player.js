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

    // 时间转换
    const duration = document.querySelector('.duration') // 获取当前音频的总时长
    let min
    let sec
    // function changeTime(cur) {
    //   const track_duration = myPlayer.duration
    //   const currentTime = myPlayer.currentTime
    //   if (cur === duration) {
    //     min = Math.floor(track_duration / 60)
    //     sec = Math.floor(track_duration % 60)
    //   } else {
    //     min = Math.floor(currentTime / 60)
    //     sec = Math.floor(currentTime % 60)
    //   }
    //
    //   min = min < 10 ? (`0${min}`) : min
    //   sec = sec < 10 ? (`0${sec}`) : sec
    //
    //   cur.innerHTML = `${min}:${sec}`
    // }

    // 控制时间
    function controlTime() {
      // const curTime = document.querySelector('.curTime') // 获取当前已经播放的时间
      // window.setInterval(() => {
      //   changeTime(curTime)
      //   changeTime(duration)
      // }, 1000)
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

    // 获取数据
    function bindData() {
      let val = null
      const xhr = new XMLHttpRequest()
      // false表示同步请求（如果数据没有请求回来将不进行下面的操作）
      xhr.open('get', '/api/app/radio', true)
      // 监听ajax请求的状态
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          val = xhr.responseText
          data = JSON.parse(val)
          console.log(data)
          musicControl()
        }
      }
      xhr.send()
    }

		// 下一首歌
    function nextMusic() {
      // index++
      // index = index === data.length ? 0 : index
      bindData()
      musicControl()
    }

    const nextBtn = document.getElementById('nextA')
    EventUtil.addHandler(nextBtn, 'click', () => {
      nextMusic()
    })

    // 数据绑定
    // 控制进度条面板
    let timer = null
    const progress_inner = document.querySelector('.determinate')
    function musicControl() {
      const track_name_el = document.querySelector('.track_name')
      const artist_el = document.querySelector('.artist')
      const track_cover_el = document.querySelector('.track_cover')
      let artist = null
      let track_cover = null
      let track_url = null
      let track_name = null
      track_cover_el.style.width = '500px'
      track_url = data.url
      track_name = data.name
      artist = data.artist
      track_cover = data.cover
      controlTime()
      myPlayer.src = track_url
      track_name_el.innerText = track_name
      artist_el.innerText = artist
      track_cover_el.src = track_cover
      track_cover_el.style.width = '100%'
      progress_inner.style.width = 1
      myPlayer.load()
    }


    function controlProgress() {
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
      // 播放结束自动进行下一首
      if (progress_inner.style.width == '100%') {
        nextMusic()
      }
    }
    timer = window.setInterval(() => {
      controlProgress()
      if (!myPlayer.paused) {
        $('playpause').innerText = 'pause'
      }
    }, 1000)



		// 控制音量
		// var voice_inner = document.querySelector('.voice_inner');
		// EventUtil.addHandler(voice_inner.parentNode, 'click', function(e) {
			// e = e || window.event;
			// var disY = parseInt(this.offsetHeight - (e.clientY - utils.offset(this).top));
			// voice_persent = disY / this.parentNode.offsetHeight;
			// voice_inner.style.height = voice_persent * this.offsetHeight + 'px'; //问题解决：旋转180度
			// myPlayer.volume = voice_persent;
		// });

    function init() {
      bindData()
      musicControl()
    }
    init()
  }()
}
