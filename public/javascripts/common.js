$(function() {
  $('#content').trigger('autoresize')
  $('.modal').modal()
  $(".button-collapse").sideNav()
  $('select').material_select()


	$('#modal').click(function() {
    const data_id = $(this).attr('data-id')
    const url = `/api/admin/tracks?id=${data_id}`
    $.ajax({
      url: url,
    })
		.done(result => {
      const track = result
      $('.modal').modal()
      document.getElementById('track_id').value = track.track_id
      document.getElementById('track_artist').value = track.track_artist
      document.getElementById('track_name').value = track.track_name
      document.getElementById('track_cover').value = track.track_cover
      document.getElementById('track_url').value = track.track_url
      document.getElementById('track_lrc').value = track.track_lrc
      document.getElementById('track_lrc_cn').value = track.track_lrc_cn
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

	$('#delete').click(function() {
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

  $('#done').click(function(event) {
    const article_id = $(this).attr('page')
    $.ajax({
      url: '/api/admin/ready',
      type: 'POST',
      data: { article_id }
    })
    .always(function() {
      location.href = '/api/admin/articles'
    })
  })

  $('#edit').click(function(event) {
    const a_id = $(this).attr('article_id')
    const url = `/api/app/articles?id=${a_id}`
    $.ajax({
      url: url,
    })
    .done(result => {
      console.log(result)
      const article = result
      $('.modal').modal()
      document.getElementById('title').value = article.article_title

    })
    .fail(function() {
      console.log("error");
    })
  })

  $('#new').click(function(event) {
    /* Act on the event */
    const form = $('.new_track')
    const track = JSON.stringify(form.serializeArray())
    $.ajax({
				url: '/api/admin/tracks/new',
				type: 'POST',
				data: track,
				contentType: 'application/json',
				success: data => {
          // 刷新页面
          // location.reload()
        },
				error: errorThrown => {
					alert(`error: ${errorThrown}`)
				},
			})
  })

  $('.delete_article').click(function(event) {
    $('#submit').attr('data-id', $(this).attr('data-id'))
  })

  $('#submit').click(function(event) {
    const a_id = $(this).attr('data-id')
    const url = `/api/admin/article/${a_id}`
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

  const trlist = $('#tracks').children('tr')
  const ids = []
  for (let i = 0; i < trlist.length; i++) {
    const tdArr = trlist.eq(i).find('td')
    ids.push(tdArr.eq(0).text())
  }

  document.getElementById('ids').value = ids
})
