// Create assistant
async function createAssistant(params) {
	const assistant = await openai.beta.assistants.create({
		name: 'Data visualizer',
		description:
			'You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.',
		model: 'gpt-4-1106-preview',
		tools: [{ type: 'code_interpreter' }, { type: 'retrieval' }],
		file_ids: [file.id],
	})
	return assistant
}
module.exports = {
	createAssistant,
}
