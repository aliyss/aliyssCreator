const fs = require("fs")

class Instance {
	
	constructor(_client) {
		this.id = _client.id;
		this.name = _client.name;
		this.type = _client.type;
		this.config = _client.config;
		this.folder = _client.folder;

		this.modula = require("./types/" + this.type + ".js");
		
		if (_client.events) {
			this._events = _client.events;
		}
		
		try {
			if (!this.config.auth) {
				this.config.auth = require(this.folder + this.id + ".json")
			}
		} catch (e) {
			console.log(`AuthenticationFile does not exist. Login manually.`);
		}
		
		this.client = this.addClient()
	}

	addClient = (config=this.config) => {
		return this.modula.add(config)
	}
	
	start = async (client=this.client) => {
		this.modula.start(client, this.config)
	}
	
	saveAuth = async (auth = {}) => {
		let saveLocation = this.folder + this.id + ".json"
		await fs.writeFile(saveLocation, JSON.stringify(auth, null, 4), function (err) {
			if (err) throw err;
			console.log(`AuthenticationFile saved: ${saveLocation}`);
		});
	}
	
	disableEvents = (client=this.client, ignoredEvents) => {
		if (!ignoredEvents) {
			ignoredEvents = this._events && this._events.ignored ? this._events.ignored : [];
		}
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