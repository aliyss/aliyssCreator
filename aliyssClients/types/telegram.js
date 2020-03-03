const Telegraf = require('telegraf')


exports.add = (_config) => {
	try {
		return new Telegraf(_config.auth.token)
	} catch (e) {
		console.error(`[Telegram] ${e.message}`)
	}
}

exports.start = async (_client) => {
	try {
		await _client.launch()
	} catch (e) {
		console.error(`[Telegram] ${e.message}`)
	}
}