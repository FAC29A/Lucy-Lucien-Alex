const jokes = require('./jokes')
const history = require('./history')

// Data structure were we store all the commands
const commandActions = {
	ping: (message) => sendMessage(message, 'Pong!'),
	hello: (message) => sendMessage(message, 'Hi there!'),
	joke: (message) => randomJokes(message),
	echo: (message) => echoMessage(message),
	history: sendHistory,

	help: sendHelpMessage,
	// Add more commands and actions here
}

function sendMessage(message, response) {
	message.reply(response)
}

function sendHelpMessage(message) {
	// Get the command names from the commandActions object
	const commandNames = Object.keys(commandActions)

	// Create a help text string listing all commands
	const helpText =
		'Available commands:\n' + commandNames.map((name) => `!${name}`).join('\n')

	message.reply(helpText)
}

function randomJokes(message) {
	const randomIndex = Math.floor(Math.random() * jokes.length)
	const randomJoke = jokes[randomIndex]
	message.reply(randomJoke)
}

function sendHistory(message) {
	// Construct the history string
	const historyText = history.join('\n')
	message.reply(historyText)
}

function echoMessage(message) {
	// The resason of slice(5) is because there are 5 character in !echo
	const messageWithoutPrefix = message.content.slice(5).trim()
	message.reply(messageWithoutPrefix)
}

module.exports = commandActions
git