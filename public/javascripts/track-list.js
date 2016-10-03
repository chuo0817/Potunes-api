$(function() {
	const trlist = $('#tracks').children('tr')
	const ids = []
	for (let i = 0; i < trlist.length; i++) {
		const tdArr = trlist.eq(i).find('td')
		ids.push(tdArr.eq(0).text())
	}
	document.getElementById('ids').value = ids

	$('.editBtn').click(function(event) {
		const list_id = $(this).attr('data-id')
		$('#dialog-form').dialog('open')
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
				success:function(data) {
						//data: return data from server
						alert(form.serializeArray())
						$('#dialog-form').dialog('close')
				},
				error: function(errorThrown) {
						alert(`error: ${errorThrown}`)
				}
			})
	}

	const dialog = $('#dialog-form').dialog({
		autoOpen: false,
		height: 400,
		width: 800,
		modal: true,
		buttons: {
			更新信息: updateTracks,
			Cancel: function() {
				$(this).dialog('close')
			}
		}
	})



	// const form = dialog.find('form').on('submit', function(event) {
	// 	event.preventDefault()
	// 	updateTracks()
	// })


})
