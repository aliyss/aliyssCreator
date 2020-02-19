
class Instance {
	
	constructor(_client) {
		this.id = _client.id;
		this.name = _client.name;
		this.type = _client.type;
		this.config = _client.config;
		
		this.modula = require("./types/" + this.type + ".js");
		try {
			this.config.session = require("./config/auth/" + this.id + ".json")
		} catch (e) {
			console.log(e.message)
		}
		
		
		this.client = this.addClient()
	}

	addClient = (config) => {
		if (!config) {
			config = this.config
		}
		return this.modula.add(config)
	}
	
	start = (client) => {
		if (!client) {
			client = this.client
		}
		this.modula.start(client)
	}
	
}

module.exports = Instance;