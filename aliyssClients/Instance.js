const fs = require("fs")
const { databaseInput } = require("./../aliyssDatabase")

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
		
	}

	addClient = async (config=this.config) => {
		return await this.modula.add(config)
	}

	addAuth = async () => {
		if (!this.config.auth) {
			return await this.database.getData(this.db_init.folder + "auth", true)
		}
	}
	
	addLayout = async () => {
		if (!this.config.layout) {
			return await this.database.getData(this.db_init.folder + "layout", true)
		}
	}
	
	start = async () => {
		this.config.auth = await this.addAuth()
		this.layout = await this.addLayout()
		this.client = await this.addClient()
		await this.modula.start(this.client, this.config)
	}
	
	saveAuth = async (auth = this.config.auth) => {
		this.config.auth = auth;
		await this.database.addData(this.db_init.folder + "auth", this.config.auth)
	}
	
	disableEvents = (client=this.client, ignoredEvents=this.events.ignored) => {
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