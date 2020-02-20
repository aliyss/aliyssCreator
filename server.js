
const fs = require('fs');

const { Instance } = require("./aliyssClients");
const { eventInput } = require("./aliyssEvents")

// Configuration File - aliyss.js
const aliyss = require('./config/aliyss.json');

// Startup configuration.
// Create directories that do not exist.
aliyss.folders.auth = __dirname.replace(/\\/g, '/') + "/config/auth/"

if (!fs.existsSync(aliyss.folders.auth)){
	fs.mkdirSync(aliyss.folders.auth);
}

let _clients = aliyss.clients
let _instances = [];

(async () => {
	for (let i = 0; i < _clients.length; i++) {
		if (_clients[i].type) {
			if (!_clients[i].folder) {
				_clients[i].folder = aliyss.folders.auth
			}
			let instance = new Instance(_clients[i])
			await instance.start()
			_instances.push(instance);
		}
	}
	await eventInput.multiInstances(_instances)
})();
