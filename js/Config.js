var fs = require('fs'),
	gui = require('nw.gui')

var Config = {},
	_configPath = process.env['HOME'] + '/.config/zenditor/config.json'

Config.save = function() {
	fs.writeFileSync(_configPath, JSON.stringify(Config, undefined, 2))
}

Config.edit = gui.Shell.openItem.bind(undefined, _configPath)

;(function init() {
	if (!fs.existsSync(_configPath))
		fs.writeFileSync(_configPath, '{}')

	var data = JSON.parse(fs.readFileSync(_configPath))
	for (var prop in data)
		Config[prop] = data[prop]
})()