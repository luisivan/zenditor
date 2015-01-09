var UI = {}
// gui.Shell.openExternal('https://github.com/rogerwang/node-webkit');

UI.fullscreen = function() {
	if (!document.webkitIsFullScreen)
		document.body.webkitRequestFullScreen()
	else
		document.webkitCancelFullScreen()
}

UI.loadTheme = function(theme) {
	var css = document.createElement('link')
  	css.setAttribute('rel', 'stylesheet')
  	css.setAttribute('href', 'bower_components/codemirror/theme/'+theme+'.css')
	document.getElementsByTagName('head')[0].appendChild(css)

	Editor.cm.setOption('theme', theme)
	document.getElementsByTagName('aside')[0].className = 'CodeMirror cm-s-' + theme
}

UI.loadNextTheme = function() {
	var i = UI.themes.indexOf(Config.theme) + 1
	if (i == UI.themes.length)
		i = 0
	var newTheme = UI.themes[i]
	UI.loadTheme(newTheme)
	Config.theme = newTheme
	Config.save()
}

UI.updateFilename = function() {
	document.getElementById('filename').textContent = (Editor.path) ? Editor.path.split('/').pop() : 'New file'
}

UI.updateWordCounter = function() {
	var c = Editor.countWords()
	document.getElementById('wordCount').textContent = c[0]
	document.getElementById('readingTime').textContent = c[1]
}

UI.loadThemes = function() {
	UI.themes = fs.readdirSync('./bower_components/codemirror/theme')

	UI.themes = UI.themes.join('').split('.css')
	UI.themes.pop()
}

UI.applyConfig = function() {
	document.body.style.backgroundImage = 'url("' + Config.backgroundImage + '")'
	UI.loadTheme(Config.theme)

	var props = ['fontFamily', 'fontSize']
	for (var i in props)
		document.body.style[props[i]] = Config[props[i]]
}

UI.bindKeys = function() {
	var openInput = document.getElementById('open')
	openInput.onchange = function() {
		openInput.value && Editor.open(openInput.value)
		openInput.value = null
	}
	var saveAsInput = document.getElementById('saveAs')
	saveAsInput.onchange = function() {
		saveAsInput.value && Editor.save(saveAsInput.value)
	}

	var keymap = {
	  	'F11': UI.fullscreen,
	  	'Ctrl-P': Config.edit,
	  	'Ctrl-T': UI.loadNextTheme,
	  	'Ctrl-N': Editor.open.bind(undefined, null),
	  	'Ctrl-O': openInput.click.bind(openInput),
		'Ctrl-S': function(e) {
			if (Editor.path)
				Editor.save()
			else
				saveAsInput.click()
		},
		'Shift-Ctrl-S': saveAsInput.click.bind(saveAsInput)
	}
	Editor.cm.addKeyMap(keymap)
}

;(function init() {
	
	Editor.cm.on('blur', Editor.cm.focus.bind(Editor.cm))

	UI.loadThemes()
	UI.applyConfig()
	UI.bindKeys()

	Editor.open(localStorage.getItem('path'))

})()