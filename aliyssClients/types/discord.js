const Discord = require('discord.js');


exports.add = (_config) => {
	return new Discord.Client();
}

exports.start = (_client, _config) => {
	_client.login(_config.auth.token);
}