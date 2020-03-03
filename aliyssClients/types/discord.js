const Discord = require('discord.js');


exports.add = (_config) => {
	return new Discord.Client();
}

exports.start = async (_client, _config) => {
	try {
		await _client.login(_config.auth.token);
	} catch (e) {
		console.error(`[Discord] ${e.message}`)
	}
}