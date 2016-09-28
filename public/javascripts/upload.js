function getFileSize(file) {
	let fileSize = 0
	if (file.size > 1024 * 1024) {
		fileSize = `${(Math.round(file.size * 100 / (1024 * 1024)) / 100).toString()}MB`
	} else {
		fileSize = `${(Math.round(file.size * 100 / 1024) / 100).toString()}KB`
	}
	document.getElementById('fileName').innerHTML = `文件名称:${file.name}`
	document.getElementById('fileSize').innerHTML = `文件大小:${fileSize}`
	document.getElementById('fileType').innerHTML = `文件类型:${file.type}`
}

// 选择上传
function fileSelected(file) {
	const uploadedFile = document.getElementById('fileToUpload').files[0]
	if (uploadedFile) {
		getFileSize(uploadedFile)
		const button = document.getElementById('submit')
		button.disabled = false
	}
}
function upload(formData) {
	alert(formData)
	const xhr = new XMLHttpRequest()
	xhr.open('POST', '/track-list')
	xhr.send(formData)
}

// 点击上传文件操作
function uploadFile() {
	const fd = new FormData()
	const file = document.getElementById('fileToUpload').files[0]
	fd.append('fileToUpload', file)
	if (!file) {
		alert('您没有选择文件')
		return
	}
	// const formData = new FormData()
	// formData.append('fileToUpload', document.getElementById('fileToUpload').files[0])
	upload(fd)
}
