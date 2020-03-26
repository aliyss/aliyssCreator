const {dock} = require("@nlpjs/basic");

exports.addNLP = async (_data, _instance) => {
	let useData = [
		'Basic',
		{ "className": "BuiltinMicrosoft", "name": "extract-builtin-??", "path": "@nlpjs/builtin-microsoft" },
		{ "className": "LangEn", path: "@nlpjs/lang-en"}
	]
	
	if (_instance.layout.nlp.useData) {
		useData = _instance.layout.nlp.useData
	}
	
	const _dock = await dock.createContainer(_instance.id, {
		use:  useData,
		settings: {
			nlp: {
				log: false,
			},
		},
	});
	
	const nlp = _dock.get('nlp');
	for (let i = 0; i < _data.length; i++) {
		await this.addNLPCorpus(nlp, _data[i].data())
	}
	
	await this.trainNLP(nlp)
	
	console.log(`[${_instance.id}] NlpManager: Epochs loaded.`)
	
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