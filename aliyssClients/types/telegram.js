const Telegraf = require('telegraf')


exports.add = (_config) => {
	return new Telegraf(_config.auth.token)
}

exports.start = (_client, _config) => {
	_client.launch()
}