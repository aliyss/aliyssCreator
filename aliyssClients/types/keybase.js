const Bot = require('keybase-bot')


exports.add = (_config) => {
	return new Bot();
}

exports.start = async (_client, _config) => {
	try {
		await _client.initFromRunningService()
	} catch (e) {
		console.error(`[KeyBase] ${e.message}`)
	}
}