const { Client } = require("whatsapp-web.js")

exports.add = (_config) => {
	if (!_config.browser) {
		_config.browser = {
			"headless": false,
			"defaultViewport": null
		}
	}
	return new Client({ puppeteer: _config.browser, session: _config.auth})
}

exports.start = (_client) => {
	_client.initialize();
}