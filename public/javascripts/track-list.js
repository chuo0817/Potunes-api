/* global $ */
/* eslint func-names: ["error", "always"]*/
/* eslint-disable func-names */
/* eslint object-shorthand: ["error", "always", { "avoidQuotes": true }]*/
/* eslint no-alert: "error" */
$(function() {
	const trlist = $('#tracks').children('tr')
	const ids = []
	for (let i = 0; i < trlist.length; i++) {
		const tdArr = trlist.eq(i).find('td')
		ids.push(tdArr.eq(0).text())
	}
	document.getElementById('ids').value = ids

	$('.editBtn').click(function() {
		const data_id = $(this).attr('data-id')
		const url = `/tracks?id=${data_id}`
		$.ajax({
			url: url,
		})
		.done(result => {
			const track = result
			// alert(track[1])
			$('#dialog-form').dialog('open')
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

	$('.removeBtn').click(function() {
		const track_id = $(this).attr('data-id')
		const data = { track_id }

		const r = confirm('确定要删除吗?')
		if (r === false) return
		$.ajax({
			url: `/tracks/${track_id}`,
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

	function updateTracks() {
		const form = $('#update')
		const updateInfo = JSON.stringify(form.serializeArray())
		$.ajax(
			{
				url: '/track-list',
				type: 'POST',
				data: updateInfo,
				contentType: 'application/json',
				success: data => {
					alert('更新成功')
					$('#dialog-form').dialog('close')
					// 刷新页面
					location.reload()
				},
				error: errorThrown => {
					alert(`error: ${errorThrown}`)
				},
			})
	}

	$('#dialog-form').dialog({
		autoOpen: false,
		height: 500,
		width: 800,
		modal: true,
		buttons: {
			更新信息: updateTracks,
			Cancel: function() {
				$(this).dialog('close')
			},
		},
	})
})
