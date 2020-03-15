const { NlpManager } = require("node-nlp");

exports.addNLP = async (_data, _instanceId) => {
	//const _dock = await dock.createContainer(_instanceId, {nlu: { log: false } });
	const nlp = new NlpManager({ nlu: {log: false } }) //_dock.get('nlp');
	for (let i = 0; i < _data.length; i++) {
		await nlp.nlp.addCorpus(_data[i].data())
	}
	await this.trainNLP(nlp)
	console.log(`[${_instanceId}] NlpManager: Epochs loaded.`)
	return nlp
}

exports.addNLPCorpus = async (nlp, _data) => {
	if (!_data || !_data.name) {
		return;
	}
	// noinspection JSUnresolvedFunction
	await nlp.addCorpus(_data);
}

exports.trainNLP = async (nlp) => {
	// noinspection JSUnresolvedFunction
	await nlp.train();
}

exports.processNLP = async (nlp, input) => {
	return await nlp.process(input);
}