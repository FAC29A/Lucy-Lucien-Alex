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
	echo: (message, botId) => echoMessage(message, botId),
	history: sendHistory,
	ask: (message, botId) => chatGPT(message, botId),
	help: sendHelpMessage,
	poll: (message) => pollCommand(message),
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

function echoMessage(message, botId) {
	if (
		message.content.startsWith('!echo') ||
		message.content.includes(`<@${botId}> echo`)
	) {
		// Extract the content after "echo"
		const commandIndex = message.content.indexOf('echo')

		if (commandIndex !== -1) {
			// If 'echo' is found in the message, extract the content
			const messageWithoutPrefix = message.content
				.slice(commandIndex + 4)
				.trim()
			// Reply with the extracted content
			message.reply(messageWithoutPrefix)
		} else {
			// If 'echo' is not found, reply with an error
			message.reply('echo wrong spelling')
		}
	} else {
		// If the message doesn't match the expected formats, reply with an error
		message.reply("the at didn't even catched ")
	}
}

// Object to store conversation histories
const conversations = {}

async function chatGPT(message, botId) {
	// User ID as the key for conversation history
	const userId = message.author.id

	//Initialise conversation
	let introPrompt
	let query = message.content
	let reminder =
		'Remind to act like Bender, the funny and rude robot from Futurama.'
	// Initialize conversation history if not present
	if (!conversations[userId]) {
		introPrompt = `Your user is ${botId}. You are Bender, the funny and rude robot from Futurama. You are in a conversation with the discord user ${message.author.tag}. There is no need to intruduce yourself, everyone knows you. You will use his typical expressions, like "cachocarne" in the Spanish version. When answering address to me by my name to make the interaction more personalised, try to guess my name using my Discord username. `
		console.log(`Your name is: ${message.author.tag}`)
		conversations[userId] = [
			{
				role: 'system',
				content: introPrompt + query,
			},
		]
	} else {
		introPrompt = ''
	}

	// Check if the message starts with "!ask"
	if (query.startsWith('!ask ')) {
		query = message.content.replace('!ask ', '').trim()
		// Combine the system message content with the query from the user
	}

	let systemMessageContent = introPrompt

	console.log(`Length : ${conversations[userId].length}`)
	// Add the reminder every 10th message
	if (conversations[userId].length % 9 === 0) {
		systemMessageContent += reminder
	}

	// Combine the system message content with the user's query
	let completeMessage = systemMessageContent + query

	// Add the query to the conversation
	conversations[userId].push({ role: 'user', content: completeMessage })
	console.log(`The query is: ${completeMessage}`)

	// Call the OpenAI API for a chat completion
	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: conversations[userId],
		})

		// Get the reply and add it to the conversation history
		const reply = completion.choices[0].message.content
		conversations[userId].push({ role: 'assistant', content: reply })

		// Limit the conversation history length to avoid large payloads
		if (conversations[userId].length > 10) {
			conversations[userId] = conversations[userId].slice(-10)
		}

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

// Function to handle the 'poll' command
function pollCommand(message) {
	// Extract the question and options from the message content

	const regex = /\[([^\]]+)]/g
	// Extract matches from the message content
	const matches = []
	let match
	while ((match = regex.exec(message.content)) !== null) {
		matches.push(match[1])
	}

	// Ensure at least a question and two options are provided
	if (matches.length >= 3) {
		// Extract the question and options from the matches
		const question = matches[0]
		const options = matches.slice(1)

		// Create the poll message
		const pollMessage =
			`**${question}**\n\n` +
			options.map((option, index) => `${index + 1}. ${option}`).join('\n')

		// Send the poll message
		message.channel.send(pollMessage).then((poll) => {
			// Add reactions to the poll message for each option
			options.slice(0, 9).forEach((_, index) => {
				poll.react(`${index + 1}\u20e3`) // React with number emoji
			})

			// Create a filter for reactions (only allow reactions from the message author)
			const filter = (reaction, user) => {
				return options
					.slice(0, 9)
					.some(
						(_, index) =>
							reaction.emoji.name === `${index}\u20e3` &&
							user.id === message.author.id
					)
			}

			// Create a collector to listen for reactions
			const collector = poll.createReactionCollector({ filter, time: 60000 }) // Collect reactions for 60 seconds

			// Initialize a map to store vote counts for each option
			const votes = new Map(
				options.slice(0, 9).map((_, index) => [index + 1, 0])
			)

			console.log(votes)

			// Listen for reactions and update vote counts
			collector.on('collect', async (reaction) => {
				const index = parseInt(reaction.emoji.name, 10)
				// Ensure the bot's user ID is not included in the list of users who reacted
				const reactedUsers = await reaction.users.fetch()
				if (!reactedUsers.has(client.user.id)) {
					// Skip incrementing the vote count if the bot reacted
					votes.set(index, votes.get(index) + 1)
				}
			})

			// Listen for the 'end' event to display poll results
			collector.on('end', () => {
				const resultsMessage =
					`Poll results for **${question}**\n\n` +
					options
						.slice(0, 9)
						.map(
							(option, index) =>
								`${index + 1}. ${option}: ${votes.get(index + 1)} votes`
						)
						.join('\n')
				message.channel.send(resultsMessage)
			})
		})
	} else {
		// If not enough arguments are provided, notify the user
		sendMessage(
			message,
			'Please provide a question and at least two options for the poll.'
		)
	}
}
module.exports = commandActions
