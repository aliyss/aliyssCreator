const fs = require("fs")
const { databaseInput } = require("./../aliyssDatabase")
const { nlpManager } = require('./nlp')

class Instance {

	constructor(_client) {
		this.id = _client.id;
		this.name = _client.name ? _client.name : _client.id;
		this.type = _client.type;
		this.config = _client.config;
		this.events = _client.events;
		this.db_init = _client.db_init;
		this.database = _client.database;

		this.modula = require("./types/" + this.type + ".js");

		if (!this.config) {
			this.config = {}
		}

		if (!this.events) {
			this.events = {}
		}

		if (!this.events.ignored) {
			this.events.ignored = []
		}

		if (!this.database) {
			this.database = databaseInput.databaseFull(this.db_init)
		}

		if (!this.logs) {
			this.logs = []
		}

	}

	addClient = async (config = this.config) => {
		return await this.modula.add(config)
	}

	addAuth = async () => {
		if (!this.config.auth) {
			return await this.database.getData(this.db_init.folder + "auth", true)
		}
	}

	addLayout = async () => {
		if (!this.layout) {
			return await this.database.getData(this.db_init.folder + "layout", true)
		}
	}

	addNLP = async () => {
		if (!this.nlp) {
			let _nlpData = await this.database.getData(this.db_init.folder + "nlpData/default")
			let _nlpShared = await this.database.getData("\\instances\\" + "nlpData/default")
			let _nerData = await this.database.getData(this.db_init.folder + "nerData/default")
			let _nerShared = await this.database.getData("\\instances\\" + "nerData/default")
			return nlpManager.addNLP({ _nlpData, _nlpShared }, { _nerData, _nerShared }, this)
		}
	}

	addUsers = async () => {
		if (!this.users) {
			return {}
		}
	}

	addChannels = async () => {
		if (!this.channels) {
			return {}
		}
	}

	addChannelGroups = async () => {
		if (!this.channelGroups) {
			return {}
		}
	}

	getUser = async (user_id, data=false) => {
		if (!this.users[user_id]) {
			if (data) {
				data = JSON.parse(JSON.stringify(data))
				this.users[user_id] = { ...data }
				delete data.author
			}
			let _user = await this.database.getData(this.db_init.folder + "layout/users/" + user_id, data)
			if (_user) {
				this.users[user_id] = { ...this.users[user_id], ..._user };
			}
		}
		return this.users[user_id]
	}

	getChannel = async (channel_id, data=false) => {
		if (!this.channels[channel_id]) {
			if (data) {
				data = JSON.parse(JSON.stringify(data))
				delete data.channel
			}
			let _channel = await this.database.getData(this.db_init.folder + "layout/channels/" + channel_id, data)
			if (_channel) {
				this.channels[channel_id] = _channel;
			}
		}
		return this.channels[channel_id]
	}
	
	getChannelGroup = async (channelGroup_id, data=false) => {
		if (!this.channelGroups[channelGroup_id]) {
			if (data) {
				data = JSON.parse(JSON.stringify(data))
				delete data.channelGroup
			}
			let _channelGroup = await this.database.getData(this.db_init.folder + "layout/channelGroups/" + channelGroup_id, data)
			if (_channelGroup) {
				this.channelGroups[channelGroup_id] = _channelGroup;
			}
		}
		return this.channelGroups[channelGroup_id]
	}

	start = async () => {
		this.config.auth = await this.addAuth()
		this.layout = await this.addLayout()
		if (this.layout.nlp) {
			this.nlp = await this.addNLP()
		}
		this.users = await this.addUsers()
		if (!this.users) {
			this.users = {}
		}
		this.channels = await this.addChannels()
		if (!this.channels) {
			this.channels = {}
		}
		this.channelGroups = await this.addChannelGroups()
		if (!this.channelGroups) {
			this.channelGroups = {}
		}
		this.client = await this.addClient()
		await this.modula.start(this.client, this.config)
	}

	saveAuth = async (auth = this.config.auth) => {
		this.config.auth = auth;
		await this.database.addData(this.db_init.folder + "auth", this.config.auth)
	}
	
	saveUsers = async (_path, _data) => {
		if (!_path && !_data) {
			let errors = []
			for (let [key, value] of Object.entries(this.users)) {
				delete value.author;
				delete value.avatarUrl;
				_path = `layout/users/${value.id}`
				_data = JSON.parse(JSON.stringify(value))
				try {
					await this.database.addData(this.db_init.folder + _path, _data)
				} catch (e) {
					errors.push(e)
					console.log(`[Database]: failed to upload user ${value.id}`)
				}
			}
			return `Data Uploaded to Database. Error Count: ${errors.length}`
		}
		await this.database.addData(this.db_init.folder + _path, _data)
	}

	disableEvents = (client = this.client, ignoredEvents = this.events.ignored) => {
		for (let i = 0; i < ignoredEvents.length; i++) {
			try {
				client.removeAllListeners(ignoredEvents[i]);
			} catch (e) {
				console.log(`IgnoredEvents of ${this.name} with ${ignoredEvents[i]}:`, e)
			}
		}
	}

}

module.exports = Instance;