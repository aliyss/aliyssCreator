const { Client } = require("whatsapp-web.js")

exports.add = (_config) => {
	return new Client({ puppeteer: _config.browser , session: _config.auth})
}

exports.start = (_client) => {
	_client.initialize();
}