// initialize
const port = 8888
const express = require('express')

exports.add = (_config) => {
	return express()
}

exports.start = async (_client, _config) => {
	try {
		
		_client.use(express.json())
		
		_client.post('/', (req, res) => {
			req.resultMain = res
			_client.emit('message', req)
		});
		
		await _client.listen(port, () =>
			console.log(`[Rest] Server started on port ${port}`)
		);
	} catch (e) {
		console.error(`[Rest] ${e.message}`)
	}
}