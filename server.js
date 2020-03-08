
const fs = require('fs');
const path = require("path");

const { Instance } = require("./aliyssClients");
const { eventInput } = require("./aliyssEvents");
const { databaseInput } = require("./aliyssDatabase")

// Configuration File - aliyss.js
const configPath = './config/aliyss.json'
let configFolder = path.dirname(configPath)
const db_config = require(configPath);

let _clients = {}
let _instances = [];


// Startup configuration.
// Create directories that do not exist.

(async () => {
	
	if (db_config.db_init.type === "json") {
		configFolder = path.resolve(configFolder)
	}
	
	db_config.db_init = await databaseInput.configCheck(db_config.db_init, configFolder)
	
	_clients = await databaseInput.databaseFull(db_config.db_init).getData(db_config.db_init.folder + "clients")
	_clients = _clients.clients
	
	for (let i = 0; i < _clients.length; i++) {
		if (_clients[i].type && _clients[i].enabled) {
			
			if (!_clients[i].db_init) {
				_clients[i].db_init = db_config.db_init
			}
			
			_clients[i].db_init = await databaseInput.configCheck(_clients[i].db_init, configFolder, _clients[i].id)
			
			let instance = new Instance(_clients[i])
			await instance.start()
			
			_instances.push(instance);
		}
	}
	await eventInput.multiInstances(_instances)
})();
