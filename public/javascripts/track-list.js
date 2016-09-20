function update() {
  var content = document.tracksInfo.content.value;
  var tracks = document.querySelectorAll('.trackId');
  var result = content.split('.mp3 ');
  var trackInfos = [];
  var ids = [];

  for (var i = 0; i < result.length; i++) {
    var sub = result[i].substring(3)
    if (i == result.length - 1) {
      sub = sub.substring(0, sub.length - 4);
    }
    trackInfos.push(sub);
    ids.push(tracks[i].innerHTML);
  }
  alert(ids);
  var postForm = document.getElementById('form-horizontal');
  var idsInput = document.createElement('input');
  var contentInput = document.getElementById('content');
  contentInput.value = trackInfos;
  idsInput.type = 'hidden';
  idsInput.name = 'ids';
  idsInput.value = ids.join('-');
  postForm.appendChild(idsInput);
}
