const {dock} = require("@nlpjs/basic");

exports.addNLP = async (_nlp, _ner, _instance) => {
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
				trainByDomain: false
			},
			"nlu-??": {
				log: false,
			}
		}
	});
	
	const nlp = _dock.get('nlp');
	
	let fullNLPData = [..._nlp._nlpData, ..._nlp._nlpShared]
	for (let i = 0; i < fullNLPData.length; i++) {
		await this.addNLPCorpus(nlp, fullNLPData[i].data())
	}
	
	let fullNERData = [..._ner._nerData, ..._ner._nerShared]
	for (let i = 0; i < fullNERData.length; i++) {
		let usableData = fullNERData[i].data()
		if (usableData.data) {
			for (let j = 0; j < usableData.data.length; j++) {
				await nlp.addNerRuleOptionTexts(usableData.locals, usableData.name, usableData.data[j].outputs, usableData.data[j].inputs);
			}
		}
	}
	
	// await nlp.slotManager.addSlot('command.weather', 'location', true, { en: 'For which location?' })
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