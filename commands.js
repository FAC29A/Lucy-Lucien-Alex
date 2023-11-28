const jokes = require('./jokes')
const history = require('./history')
const OpenAIApi = require('openai')

// Initialize OpenAI SDK with API key from .env file

const openai = new OpenAIApi({
	apiKey: process.env.OPENAI_API_KEY,
})

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

	// Call the OpenAI API for a chat completion
	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: 'You are a helpful assistant.' },
				{ role: 'user', content: query },
			],
		})

		console.log(completion.choices[0].message)

		// Assuming the message object has a property 'content' which is the reply
		const reply = completion.choices[0].message.content

		// Send the response back to Discord
		if (reply) {
			message.reply(reply.trim())
		} else {
			message.reply("I didn't get a response. Please try again.")
		}
	} catch (error) {
		console.error('Error calling OpenAI:', error)
		message.reply(
			'Sorry, I encountered an error while processing your request.'
		)
	}
}

module.exports = commandActions
