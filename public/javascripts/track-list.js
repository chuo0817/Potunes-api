function update() {
	const content = document.tracksInfo.content.value
	const tracks = document.querySelectorAll('.trackId')
	const result = content.split('.mp3 ')
	const trackInfos = []
	const ids = []

	for (let i = 0; i < result.length; i++) {
		let sub = result[i].substring(3)
		if (i == result.length - 1) {
			sub = sub.substring(0, sub.length - 4)
		}
		trackInfos.push(sub)
		ids.push(tracks[i].innerHTML)
	}
	const postForm = document.getElementById('form-horizontal')
	const idsInput = document.createElement('input')
	const contentInput = document.getElementById('content')
	contentInput.value = trackInfos
	idsInput.type = 'hidden'
	idsInput.name = 'ids'
	idsInput.value = ids.join('-')
	postForm.appendChild(idsInput)
}
