const fs = require('fs')

// Configuration File - aliyss.js
const aliyss = require('./config/aliyss.json');

let _clients = aliyss.clients
let clients = [];

function runFile(file) {
	let commandFile = require(file);
	return commandFile.run();
}

(async () => {
	for (let i = 0; i < _clients.length; i++) {
		if (_clients[i].type) {
			let current_client = runFile(_clients[i].type, _clients.id)
			clients.push({id: _clients[i].id, client: current_client});
		}
	}
})();
