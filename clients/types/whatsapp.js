const { Client } = require("whatsapp-web.js")

module.exports.add = (_config) => {
	return new Client({ puppeteer: _config.browser , session: _config.session})
}

module.exports.start = (_client) => {
	_client.initialize();
}