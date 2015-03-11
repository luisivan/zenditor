'use strict'

var fs = require('fs'),
	gui = require('nw.gui')

class Config {
	constructor() {
		this.path = process.env['HOME'] + '/.config/zenditor/config.json'

		if (!fs.existsSync(this.path))
			fs.writeFileSync(this.path, '{}')

		this.props = JSON.parse(fs.readFileSync(this.path))
	}
	set theme(val) {
		this.props['theme'] = val
		this.save()
	}
	save() {
		fs.writeFileSync(this.path, JSON.stringify(Config, undefined, 2))
	}
	edit() {
		gui.Shell.openItem(this.path)
	}
}