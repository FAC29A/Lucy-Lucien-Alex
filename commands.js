// commands.js

function sendMessage(message, response) {
	message.reply(response)
}

function sendHelpMessage(message) {
	const helpText =
		'Available commands:\n\t!hello: returns "Hi There"\n\t!ping: returns "Pong!"'
	message.reply(helpText)
}

const commandActions = {
	ping: (message) => sendMessage(message, 'Pong!'),
	hello: (message) => sendMessage(message, 'Hi there!'),
	help: sendHelpMessage,
	// Add more commands and actions here
}

module.exports = commandActions
