// commands.js

const commands = {
	ping: sendMessage,
	hello: sendMessage,
	help: sendHelpMessage
	// Add more commands and corresponding functions here
}

function sendMessage(message, response) {
	message.reply(response)
}

function sendHelpMessage(message) {
	const helpText =
		'Available commands:\n\t!hello: returns "Hi There"\n\t!ping: returns "Pong!"'
	message.reply(helpText)
}

module.exports = commands
