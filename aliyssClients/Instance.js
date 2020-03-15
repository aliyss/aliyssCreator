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
			return nlpManager.addNLP(_nlpData, this.id)
		}
	}

	addUsers = async () => {
		if (!this.users) {
			let _users = {}
			let users = await this.database.getData(this.db_init.folder + "layout/users", true)
			for (let i = 0; i < users.length; i++) {
				_users[users[i].id] = await users[i].data();
			}
			return _users
		}
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
		this.client = await this.addClient()
		await this.modula.start(this.client, this.config)
	}

	saveAuth = async (auth = this.config.auth) => {
		this.config.auth = auth;
		await this.database.addData(this.db_init.folder + "auth", this.config.auth)
	}
	
	saveData = async (_path, _data) => {
		if (!_path && !_data) {
			let errors = []
			for (let [key, value] of Object.entries(this.users)) {
				delete value.author;
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

	addContext = nlpManager.Context

}

module.exports = Instance;