'use strict'

class Editor {
	constructor() {
		this.cm = CodeMirror.fromTextArea(document.getElementsByTagName('textarea')[0], {
			autofocus: true,
			lineWrapping: true,
			mode: 'markdown'
		})
	}
	get path() {
		return this._path
	}
	set path(path) {
		this._path = path
		ui && ui.updateFilename()
		localStorage.setItem('path', path)
	}
	countWords() {
		var n = this.cm.doc.getValue().replace(/\n/g, ' ').replace(/\s+/g, ' ').split(' ')
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
	open(path) {
		if (path == 'null') path = null
		this.path = path
		var content = (path) ? fs.readFileSync(path, 'utf8') : ''
		this.cm.doc.setValue(content)
	}
	save(path) {
		if (path) this.path = path

		fs.writeFileSync(editor.path, editor.cm.doc.getValue(), 'utf8')
	}
}