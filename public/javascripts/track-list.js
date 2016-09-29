$(function() {
	const url = document.getElementById('create').href
	const page_id = url.split('=')
	document.getElementById('page').value = page_id[1]
})
