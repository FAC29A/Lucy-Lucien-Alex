// Load environment variables from .env file
require('dotenv').config()

// Import necessary classes from discord.js library
const { Client, Events, GatewayIntentBits } = require('discord.js')
const commandActions = require('./commands')
const jokes = require('./jokes.js')

//Array that will contain the history
const history = require('./history')

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
})

const prefix = '!' // Set your desired command prefix

client.once(Events.ClientReady, (createdClient) => {
	console.log(`Ready! Logged in as ${createdClient.user.tag}`)
	//
})

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return

	// Get the bot's user ID
	let botId = client.user.id
	console.log(`botId= ${botId}`)

	// Check if the message mentions the bot
	if (
		message.content.includes(`<@${botId}>`) ||
		message.content.includes(`<@!${botId}>`)
	) {
		// Respond to the mention
		//commandActions['answerMention'](message,botId)
		commandActions['ask'](message, botId)
		console.log(`Message: ${message.content}`)
		history.push(`${message.author.tag}: ${message.content}`)
	}

	//console.log(`${message.author.tag}: ${message.content}`)
	history.push(`${message.author.tag}: ${message.content}`)

	if (message.content.startsWith(prefix)) {
		const command = message.content.slice(prefix.length).trim().split(/ +/)[0]

		if (command in commandActions) {
			commandActions[command](message, botId)
		} else {
			message.reply(`Command not found: ${command}`)
			console.log(`Command not found: ${command}`)
		}
	}
})

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN)
