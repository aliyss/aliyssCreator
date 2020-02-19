
const { Instance } = require("./clients/index.js")

// Configuration File - aliyss.js
const aliyss = require('./config/aliyss.json');

let _clients = aliyss.clients
let _instances = [];

function runFile(file) {
	let commandFile = require(file);
	return commandFile.run();
}

(async () => {
	for (let i = 0; i < _clients.length; i++) {
		if (_clients[i].type) {
			_instances.push(new Instance(_clients[i]));
		}
	}
	_instances[0].start()
	_instances[0].client.on('qr', qr => {
		console.log(qr)	
	});
})();
