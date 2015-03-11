'use strict'

class UI {
	constructor() {
		editor.cm.on('blur', editor.cm.focus.bind(editor.cm))

		// Shouldn't be necessary, bug I suppose
		let self = this
		editor.cm.on('change', () => {
			editor.path && editor.save()
			self.updateWordCounter()
		})

		this.loadThemes()
		this.applyConfig()
		this.bindKeys()

		editor.open(localStorage.getItem('path'))
		this.updateFilename()
	}
	fullscreen() {
		if (!document.webkitIsFullScreen)
			document.body.webkitRequestFullScreen()
		else
			document.webkitCancelFullScreen()
	}
	cheatsheet() {
		var path = global.require.main.filename.split('/')
		path.pop()
		gui.Shell.openExternal('file:///' + path.join('/') + '/cheatsheet.png')
	}
	loadTheme(theme) {
		var css = document.createElement('link')
	  	css.setAttribute('rel', 'stylesheet')
	  	css.setAttribute('href', 'bower_components/codemirror/theme/'+theme+'.css')
		document.getElementsByTagName('head')[0].appendChild(css)

		if (!theme) theme = 'mdn-like'
		editor.cm.setOption('theme', theme)
		document.getElementsByTagName('aside')[0].className = 'CodeMirror cm-s-' + theme
	}
	loadNextTheme() {
		var i = this.themes.indexOf(config.props.theme) + 1
		if (i == this.themes.length)
			i = 0
		var newTheme = this.themes[i]
		this.loadTheme(newTheme)
		config.theme = newTheme
	}
	updateFilename() {
		document.getElementById('filename').textContent = (editor.path) ? editor.path.split('/').pop() : 'New file'
	}
	updateWordCounter() {
		var c = editor.countWords()
		document.getElementById('wordCount').textContent = c[0]
		document.getElementById('readingTime').textContent = c[1]
	}
	loadThemes() {
		this.themes = fs.readdirSync('./bower_components/codemirror/theme')

		this.themes = this.themes.join('').split('.css')
		this.themes.pop()
	}
	applyConfig() {
		document.body.style.backgroundImage = 'url("' + config.props.backgroundImage + '")'
		this.loadTheme(config.props.theme)

		var props = ['fontFamily', 'fontSize']
		for (var i in props)
			document.body.style[props[i]] = config.props[props[i]]
	}
	bindKeys() {
		var openInput = document.getElementById('open')
		openInput.onchange = () => {
			openInput.value && editor.open(openInput.value)
			openInput.value = null
		}
		var saveAsInput = document.getElementById('saveAs')
		saveAsInput.onchange = () => {
			saveAsInput.value && editor.save(saveAsInput.value)
		}

		var keymap = {
			'F1': this.cheatsheet,
		  	'F11': this.fullscreen,
		  	'Ctrl-P': config.edit.bind(config),
		  	'Ctrl-T': this.loadNextTheme,
		  	'Ctrl-N': editor.open.bind(undefined, null),
		  	'Ctrl-O': openInput.click.bind(openInput),
			'Ctrl-S': () => {
				if (editor.path)
					editor.save()
				else
					saveAsInput.click()
			},
			'Shift-Ctrl-S': saveAsInput.click.bind(saveAsInput)
		}
		editor.cm.addKeyMap(keymap)
	}
}