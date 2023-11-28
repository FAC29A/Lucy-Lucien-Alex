const jokes = require('./jokes')
const history = require('./history')
const { Configuration, OpenAIApi } = require('openai')

// Initialize OpenAI SDK with API key from .env file
const openai = new OpenAIApi(
	new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	})
)

// Data structure were we store all the commands
const commandActions = {
	ping: (message) => sendMessage(message, 'Pong!'),
	hello: (message) => sendMessage(message, 'Hi there!'),
	joke: (message) => randomJokes(message),
	echo: (message) => echoMessage(message),
	history: sendHistory,
	ask: (message) => chatGPT(message),
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

async function chatGPT(message) {
	// Extract the query from the message
	const query = message.content.slice('!ask '.length).trim()

	// Call the OpenAI API
	try {
		const response = await openai.Completion.create({
			model: 'text-davinci-003', // or any other model you prefer
			prompt: query,
			max_tokens: 150,
		})

		// Send the response back to Discord
		message.reply(response.choices[0].text.trim())
	} catch (error) {
		console.error('Error calling OpenAI:', error)
		message.reply(
			'Sorry, I encountered an error while processing your request.'
		)
	}
}

module.exports = commandActions
