$(function() {
  $('#content').trigger('autoresize')
  $('.modal').modal()
  $(".button-collapse").sideNav()
  $('select').material_select()


	$('.modaledit').click(function() {
    const data_id = $(this).attr('data-id')
    const url = `/api/admin/tracks?id=${data_id}`
    $.ajax({
      url: url,
    })
		.done(result => {
      const track = result
      $('.modal').modal()
      document.getElementById('track_id').value = track.id
      document.getElementById('track_artist').value = track.artist
      document.getElementById('track_name').value = track.name
      document.getElementById('track_cover').value = track.cover
      document.getElementById('track_url').value = track.url
      document.getElementById('track_lrc').value = track.lrc
      document.getElementById('track_lrc_cn').value = track.lrc_cn
		})
		.fail(function() {
			alert('error')
		})
	})

  $('#update').click(function() {
    const form = $('.details')
    const updateInfo = JSON.stringify(form.serializeArray())
    $.ajax(
			{
				url: '/api/admin/track-list',
				type: 'POST',
				data: updateInfo,
				contentType: 'application/json',
				success: data => {
          // 刷新页面
          location.reload()
				},
				error: errorThrown => {
					alert(`error: ${errorThrown}`)
				},
			})
  })

	$('.delete').click(function() {
    const track_id = $(this).attr('data-id')
		const data = { track_id }

		const r = confirm('确定要删除吗?')
		if (r === false) return
		$.ajax({
			url: `/api/admin/tracks/${track_id}`,
			type: 'DELETE',
			data: data,
		})
		.done(function() {
			location.reload()
		})
		.fail(function() {
			alert("error");
		})
	})

  $('.search').click(function() {
    const title = $(this).parent().parent().children('td').get(2).innerHTML
    const track_id = $(this).attr('data-id')

    $.ajax({
      url: '/api/admin/search_track',
      type: 'POST',
      data: { title },
      success: data => {
        console.log(data)
      },
      error: errorThrown => {
        alert(`error: ${errorThrown}`)
      },
    })


		// const data = { track_id }
    //
		// const r = confirm('确定要删除吗?')
		// if (r === false) return
		// $.ajax({
		// 	url: `/api/admin/tracks/${track_id}`,
		// 	type: 'DELETE',
		// 	data: data,
		// })
		// .done(function() {
		// 	location.reload()
		// })
		// .fail(function() {
		// 	alert("error");
		// })
	})

  $('#done').click(function(event) {
    const playlist_id = $(this).attr('page')
    $.ajax({
      url: '/api/admin/ready',
      type: 'POST',
      data: { playlist_id }
    })
    .always(function() {
      location.href = '/api/admin/playlists'
    })
  })

  $('#edit').click(function(event) {
    const a_id = $(this).attr('playlist_id')
    const url = `/api/app/playlists?id=${a_id}`
    $.ajax({
      url: url,
    })
    .done(result => {
      const playlist = result
      $('.modal').modal()
      document.getElementById('title').value = playlist.title

    })
    .fail(function() {
      alert("error");
    })
  })

  $('#new').click(function(event) {
    /* Act on the event */
    const form = $('.new_track')
    const trackInfo = form.serializeArray()
    trackInfo.push( {name:'id',value:$(this).attr('a_id')} )
    const track = JSON.stringify(trackInfo)
    $.ajax({
				url: '/api/admin/tracks/new',
				type: 'POST',
				data: track,
				contentType: 'application/json',
				success: data => {
          // 刷新页面
          location.reload()
        },
				error: errorThrown => {
					alert(`error: ${errorThrown}`)
				},
			})
  })

  $('.delete_playlist').click(function(event) {
    $('#submit').attr('data-id', $(this).attr('data-id'))
  })

  $('#submit').click(function(event) {
    const a_id = $(this).attr('data-id')
    const url = `/api/admin/playlist/${a_id}`
    $.ajax({
      url,
      type: 'POST',
    })
    .done(function() {
      location.reload()
    })
    .fail(function() {
      alert('error')
    })
  })

  $('.push').click(function(event) {
    $('.new').submit()
  })

  const trlist = $('#tracks').children('tr')
  const ids = []
  for (let i = 0; i < trlist.length; i++) {
    const tdArr = trlist.eq(i).find('td')
    ids.push(tdArr.eq(0).text())
  }

  document.getElementById('ids').value = ids
})
