$(function() {
  autosize($('textarea'))
  const trlist = $('#tracks').children('tr')
  const ids = []
  for (let i = 0; i < trlist.length; i++) {
    const tdArr = trlist.eq(i).find('td')
    ids.push(tdArr.eq(0).text())
  }
  document.getElementById('ids').value = ids

	$('.editBtn').click(function() {
    const data_id = $(this).attr('data-id')
    const url = `/api/admin/tracks?id=${data_id}`
    $.ajax({
    	url: url,
    })
		.done(result => {
			const track = result
			// alert(track[1])
			$('#update').modal()
			document.getElementById('track_id').value = track.track_id
			document.getElementById('track_artist').value = track.track_artist
			document.getElementById('track_name').value = track.track_name
			document.getElementById('track_cover').value = track.track_cover
			document.getElementById('track_url').value = track.track_url
		})
		.fail(function() {
			alert('error')
		})
		.always(function() {
		})
	})

  $('#update').click(function() {
    const form = $('.modal-body')
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

	$('.removeBtn').click(function() {
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

})
