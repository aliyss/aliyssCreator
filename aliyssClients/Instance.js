const fs = require("fs")

class Instance {
	
	constructor(_client) {
		this.id = _client.id;
		this.name = _client.name;
		this.type = _client.type;
		this.config = _client.config;
		this.folder = _client.folder

		this.modula = require("./types/" + this.type + ".js");
		
		try {
			if (!this.config.auth) {
				this.config.auth = require(this.folder + this.id + ".json")
			}
		} catch (e) {
			console.log(`AuthenticationFile does not exist. Login manually.`);
		}
		
		this.client = this.addClient()
	}

	addClient = (config) => {
		if (!config) {
			config = this.config
		}
		return this.modula.add(config)
	}
	
	start = async (client) => {
		if (!client) {
			client = this.client
		}
		this.modula.start(client)
	}
	
	saveAuth = async (auth) => {
		if (!auth) {
			auth = {};
		}
		let saveLocation = this.folder + this.id + ".json"
		await fs.writeFile(saveLocation, JSON.stringify(auth, null, 4), function (err) {
			if (err) throw err;
			console.log(`AuthenticationFile saved: ${saveLocation}`);
		});
	}
	
}

module.exports = Instance;