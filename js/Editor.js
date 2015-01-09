var Editor = {}

Editor._setPath = function(path) {
	Editor.path = path
	UI.updateFilename()
	localStorage.setItem('path', path)
}

Editor.countWords = function() {
	var n = Editor.cm.doc.getValue().replace(/\n/g, ' ').replace(/\s+/g, ' ').split(' ')
	if (n[n.length-1] == '') n.pop()
	n = n.length

	var wpm = 250,
		time = n / wpm

	if (time > 60)
		console.log('TODO')
	else {
		time = Math.round(time)
		time = (time == 0 || time == 1) ? time + 'min' : time + 'mins'
	}

	return [n, time]
}

Editor.open = function(path) {
	if (path == 'null') path = null
	Editor._setPath(path)
	var content = (path) ? fs.readFileSync(path, 'utf8') : ''
	Editor.cm.doc.setValue(content)
}

Editor.save = function(path) {
	if (path)
		Editor._setPath(path)
	fs.writeFileSync(Editor.path, Editor.cm.doc.getValue(), 'utf8')
}

;(function init() {

	Editor.cm = CodeMirror.fromTextArea(document.getElementsByTagName('textarea')[0], {
		autofocus: true,
		lineWrapping: true,
		mode: 'markdown'
	})

	Editor.cm.on('change', function() {
		Editor.path && Editor.save()
		UI.updateWordCounter()
	})
})()