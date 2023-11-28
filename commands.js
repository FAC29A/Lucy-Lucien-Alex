// Data structure were we store all the commands
const commandActions = {
	ping: (message) => sendMessage(message, 'Pong!'),
	hello: (message) => sendMessage(message, 'Hi there!'),
	randomJoke: (message) => randomJoke(message),
	history: sendHistory,
	help: sendHelpMessage,
	// Add more commands and actions here
}

function sendMessage(message, response) {
	message.reply(response)
}

function sendHelpMessage(message) {
	const helpText =
		'Available commands:\n\t!hello: returns "Hi There"\n\t!ping: returns "Pong!"'
	message.reply(helpText)
}

function randomJoke(message) {
	message.reply()
}

function sendHistory(message) {
	// Construct the history string
	const historyText = history.join('\n')
	message.reply(historyText)
}

const history = require('./history')

module.exports = commandActions
